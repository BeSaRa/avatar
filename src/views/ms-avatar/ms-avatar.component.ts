/* eslint-disable max-len */
import { AvatarInterrupterBtnComponent } from '@/components/avatar-interrupter-btn/avatar-interrupter-btn.component'
import { MsAvatarSettingsPopupComponent } from '@/components/ms-avatar-settings-popup/ms-avatar-settings-popup.component'
import { OverlayChatComponent } from '@/components/overlay-chat/overlay-chat.component'
import { AvatarService } from '@/services/avatar.service'
import { ChatHistoryService } from '@/services/chat-history.service'
import { ChatService } from '@/services/chat.service'
import { LocalService } from '@/services/local.service'
import { SpeechService } from '@/services/speech.service'
import { UrlService } from '@/services/url.service'
import { AppStore } from '@/stores/app.store'
import { CdkDragHandle } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { MatTooltipModule } from '@angular/material/tooltip'
import * as sdk from 'microsoft-cognitiveservices-speech-sdk'
import { catchError, delay, finalize, from, take, tap, throwError } from 'rxjs'
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.js'

@Component({
  selector: 'app-ms-avatar',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    OverlayChatComponent,
    AvatarInterrupterBtnComponent,
    ReactiveFormsModule,
    CdkDragHandle,
  ],
  templateUrl: './ms-avatar.component.html',
  styleUrl: './ms-avatar.component.scss',
  providers: [ChatService],
})
export default class MsAvatarComponent implements AfterViewInit {
  overlayChatComponent = viewChild.required<OverlayChatComponent>('overlayChatComponent')
  video = viewChild.required<ElementRef<HTMLVideoElement>>('video')
  audio = viewChild.required<ElementRef<HTMLAudioElement>>('audio')
  idleVideo = viewChild<ElementRef<HTMLVideoElement>>('idleVideo')
  waves = viewChild.required<ElementRef>('waves')

  private readonly urlService = inject(UrlService)
  private readonly http = inject(HttpClient)
  readonly store = inject(AppStore)
  readonly lang = inject(LocalService)
  private readonly speechService = inject(SpeechService)
  readonly avatarService = inject(AvatarService)
  readonly chatService = inject(ChatService)
  private readonly chatHistoryService = inject(ChatHistoryService)
  private readonly injector = inject(Injector)
  private readonly dialog = inject(MatDialog)

  botNames$ = this.chatHistoryService
    .getAllBotNames()
    .pipe(tap(bots => this.chatService.botNameCtrl.patchValue(bots.at(0)!)))

  private videoFormat?: sdk.AvatarVideoFormat
  private avatarConfig?: sdk.AvatarConfig
  private recognizer?: sdk.SpeechRecognizer
  private avatarSynthesizer?: sdk.AvatarSynthesizer
  private peerConnection?: RTCPeerConnection

  recognizedText = signal<string>('')
  recognizingText = signal<string>('')
  recognizingStatus = signal<boolean>(false)

  isSpeaking = false
  spokenTextQueue: string[] = []
  personalVoiceSpeakerProfileID = new FormControl('')

  settingsOpened = false
  onlineStatus = computed(() => {
    this.lang.localChange() // just to track any change for the languages
    switch (this.store.streamingStatus()) {
      case 'Started':
        return this.lang.locals.connected
      case 'InProgress':
        return this.lang.locals.connecting
      case 'Disconnecting':
        return this.lang.locals.disconnecting
      default:
        return this.lang.locals.not_connected
    }
  })

  settings: { bgImgUrl: string; size: string } = {
    bgImgUrl: '',
    size: 'Cropped-Portrait',
  }

  sizesMap: Record<string, { width: number; height: number }> = {
    Square: { width: 700, height: 700 },
    Portrait: { width: 600, height: 1000 },
    'Cropped-Portrait': { width: 400, height: 700 },
    Landscape: { width: 1920, height: 1080 },
  }

  ngAfterViewInit(): void {
    this.start()
    this._initWaveSurfer()
  }

  start() {
    this._prepareRecorder()
    this._prepareAvatar()
    this._initWebRTC()
  }

  stop() {
    if (this.avatarSynthesizer && !this.store.isStreamLoading()) {
      this.store.updateStreamStatus('Disconnecting')
      from(this.avatarSynthesizer.close())
        .pipe(
          take(1),
          finalize(() => {
            this.store.updateStreamStatus('Stopped')
            this.avatarSynthesizer = undefined
          })
        )
        .subscribe()
    }
    if (this.recognizer && !this.store.isRecordingLoading()) {
      this.store.recordingInProgress()
      this.recognizer.stopContinuousRecognitionAsync(
        () =>
          this.recognizer!.close(
            () => _stopRecognizer(),
            () => _stopRecognizer()
          ),
        () =>
          this.recognizer!.close(
            () => _stopRecognizer(),
            () => _stopRecognizer()
          )
      )
      const _stopRecognizer = () => {
        this.store.recordingStopped()
        this.recognizer = undefined
      }
    }
  }

  private _prepareRecorder() {
    this.recognizer = sdk.SpeechRecognizer.FromConfig(
      sdk.SpeechConfig.fromAuthorizationToken(this.store.speechToken.token(), this.store.speechToken.region()),
      sdk.AutoDetectSourceLanguageConfig.fromLanguages(['ar-QA', 'en-US']),
      sdk.AudioConfig.fromDefaultMicrophoneInput()
    )

    // recognizing event
    this.recognizer.recognizing = (_rec, event) => {
      if (event.result.reason === sdk.ResultReason.RecognizingSpeech) {
        this.recognizingText.set(this.recognizedText() + ' ' + event.result.text)
        this.recognizingStatus.set(true)
      }
    }
    // recognized event
    this.recognizer.recognized = (_rec, event) => {
      if (event.result.reason === sdk.ResultReason.RecognizedSpeech && this.store.isRecordingStarted()) {
        this.recognizedText.update(text => text + ' ' + event.result.text)
        this.recognizingStatus.set(false)
      }
    }

    this.recognizer.canceled = () => {
      this.store.recordingInProgress()
      this.speechService.generateSpeechToken().subscribe(() => {
        this._prepareRecorder()
        this.startRecording()
      })
    }
  }

  private _prepareAvatar() {
    this.videoFormat = new sdk.AvatarVideoFormat()

    const w = this.sizesMap[this.settings.size].width
    const h = this.sizesMap[this.settings.size].height
    const start_x = (w ? Math.ceil((1920 - w) / 2) : 0) + 20
    const end_x = w ? Math.min(1920, Math.ceil(1920 - (1920 - w) / 2) + 20) : 1920
    const start_y = 0
    const end_y = h ? Math.ceil(h) : 1080

    this.videoFormat.setCropRange(new sdk.Coordinate(start_x, start_y), new sdk.Coordinate(end_x, end_y))

    this.avatarConfig = new sdk.AvatarConfig('ebla', 'fb-avatar-01', this.videoFormat)
    this.avatarConfig.customized = true
    if (this.settings?.bgImgUrl) this.avatarConfig.backgroundImage = this.settings.bgImgUrl as unknown as URL

    const speechSynthesisConfig = sdk.SpeechConfig.fromAuthorizationToken(
      this.store.speechToken.token(),
      this.store.speechToken.region()
    )
    speechSynthesisConfig.endpointId = ''
    speechSynthesisConfig.setProperty(sdk.PropertyId.SpeechServiceConnection_LanguageIdMode, 'Continuous')

    this.avatarSynthesizer = new sdk.AvatarSynthesizer(speechSynthesisConfig, this.avatarConfig)

    this.avatarSynthesizer.avatarEventReceived = function () {
      // needed handle behaviour
    }
  }

  private _initWebRTC() {
    this.store.updateStreamStatus('InProgress')
    this.avatarService
      .getMSICEServerInfo()
      .pipe(
        catchError(err => {
          this.store.updateStreamStatus('Stopped')
          return throwError(() => err)
        })
      )
      .subscribe(res => {
        this.peerConnection = new RTCPeerConnection({
          iceServers: [
            {
              urls: [res.Urls[0]],
              username: res.Username,
              credential: res.Password,
            },
          ],
        })

        this.peerConnection.onicegatheringstatechange = event => {
          if ((event.target as unknown as RTCPeerConnection).iceGatheringState == 'complete') {
            if (this.video().nativeElement.paused) this.video().nativeElement.play().then()
            if (this.audio().nativeElement.paused) this.audio().nativeElement.play().then()
            this.store.updateStreamStatus('Started')
          }
        }

        this.peerConnection.ontrack = event => {
          if (event.track.kind === 'video') this.video().nativeElement.srcObject = event.streams[0]
          if (event.track.kind === 'audio') this.audio().nativeElement.srcObject = event.streams[0]
        }

        this.peerConnection.oniceconnectionstatechange = evt => {
          if (!this.store.isStreamLoading()) {
            const connectionState = (evt.target as unknown as RTCPeerConnection).iceConnectionState
            if (connectionState === 'connected') {
              this.store.updateStreamStatus('Started')
            }
            if (connectionState === 'disconnected') {
              this.store.updateStreamStatus('Stopped')
            }
          }
        }

        this.peerConnection.addTransceiver('video', { direction: 'sendrecv' })
        this.peerConnection.addTransceiver('audio', { direction: 'sendrecv' })

        from(this.avatarSynthesizer!.startAvatarAsync(this.peerConnection))
          .pipe(
            take(1),
            tap(() => this.store.updateStreamStatus('Started')),
            catchError(err => {
              this.store.updateStreamStatus('Stopped')
              return throwError(() => err)
            })
          )
          .subscribe()
      })
  }

  private _initWaveSurfer() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(recordingStream => {
      const waveSurfer = new WaveSurfer({
        waveColor: 'white',
        progressColor: 'white',
        container: this.waves().nativeElement,
        height: 'auto',
      })
      waveSurfer.registerPlugin(RecordPlugin.create({ scrollingWaveform: false })).renderMicStream(recordingStream)
    })
  }

  toggleStream() {
    if (this.store.isStreamLoading()) return
    this.store.isStreamStopped() ? this.start() : this.stop()
  }

  startRecording() {
    this.store.recordingInProgress()
    this.recognizer?.startContinuousRecognitionAsync(
      () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(this.recognizer?.internalData as unknown as any).privConnectionPromise.__zone_symbol__state === true &&
          this.store.recordingStarted()
        this.recognizingStatus.set(true)
      },
      () => this.store.recordingStopped()
    )
  }

  stopRecording() {
    this.recognizer?.stopContinuousRecognitionAsync(() => {
      this.store.recordingStopped()
    })
  }

  toggleRecording() {
    if (this.store.isRecordingLoading()) {
      return
    }
    if (this.store.isRecordingStarted()) {
      this.acceptText()
    } else {
      this.startRecording()
    }
  }

  acceptText() {
    if (!this.recognizedText()) return
    const value = this.recognizedText()
    this.recognizedText.set('')
    this.recognizingText.set('')
    this.recognizingStatus.set(false)
    this.stopRecording()
    this._goToEndOfChat()
    this.chatService
      .sendMessage(value, this.chatService.botNameCtrl.value)
      .pipe(delay(200))
      .subscribe(res => {
        this.speak(res.message.content)
        const assistantList = this.overlayChatComponent().container().nativeElement.querySelectorAll('.assistant')
        const intervalId = setInterval(() => assistantList[assistantList.length - 1].scrollIntoView(false), 200)
        const effectCallback = effect(
          () => {
            if (!this.overlayChatComponent().animationStatus()) {
              clearInterval(intervalId)
              effectCallback.destroy()
            }
          },
          { injector: this.injector }
        )
      })
  }

  rejectText() {
    this.recognizingText.set('')
    this.recognizedText.set('')
    this.recognizingStatus.set(false)
    this.stopRecording()
  }

  clearChat() {
    this.chatService.messages.set([])
  }

  speak(text: string, endingSilenceMs = 0) {
    if (this.isSpeaking) {
      this.spokenTextQueue.push(this._cleanText(text))
      return
    }

    this.speakNext(this._cleanText(text), endingSilenceMs)
  }

  speakNext(text: string, endingSilenceMs = 0) {
    const ttsVoice = 'ar-SA-HamedNeural'
    let ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis'
    xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US'><voice name='${ttsVoice}'
    ><mstts:ttsembedding speakerProfileId='${this.personalVoiceSpeakerProfileID.value}'>
    <mstts:leadingsilence-exact value='0'/>${this._htmlEncode(text)}</mstts:ttsembedding></voice></speak>`
    if (endingSilenceMs > 0) {
      ssml = `<speak version='1.0'
      xmlns='http://www.w3.org/2001/10/synthesis'
      xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US'
      ><voice name='${ttsVoice}'><mstts:ttsembedding speakerProfileId='${this.personalVoiceSpeakerProfileID.value}'>
      <mstts:leadingsilence-exact value='0'/>${this._htmlEncode(
        text
      )}<break time='${endingSilenceMs}ms' /></mstts:ttsembedding></voice></speak>`
    }

    this.isSpeaking = true
    this.avatarSynthesizer
      ?.speakSsmlAsync(ssml)
      .then(() => {
        if (this.spokenTextQueue.length > 0) {
          this.speakNext(this.spokenTextQueue.shift()!)
        } else {
          this.isSpeaking = false
        }
      })
      .catch(() => {
        if (this.spokenTextQueue.length > 0) {
          this.speakNext(this.spokenTextQueue.shift()!)
        } else {
          this.isSpeaking = false
        }
      })
  }

  stopSpeaking() {
    this.spokenTextQueue = []
    this.avatarSynthesizer?.stopSpeakingAsync().then(() => (this.isSpeaking = false))
  }

  toggleSettings() {
    this.settingsOpened = !this.settingsOpened
  }

  openSettingsPopup() {
    this.dialog
      .open(MsAvatarSettingsPopupComponent, { data: this.settings })
      .afterClosed()
      .subscribe((settings: { bgImgUrl: string; size: string }) => {
        if (settings) {
          this.settings = settings
          this._prepareAvatar()
          this._initWebRTC()
        }
      })
  }

  private _goToEndOfChat() {
    setTimeout(() => {
      const messagesList = this.overlayChatComponent().container().nativeElement.querySelectorAll('.user')
      messagesList[messagesList.length - 1].scrollIntoView(true)
    }, 100)
  }

  private _htmlEncode(text: string) {
    const entityMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
    }

    return String(text).replace(/[&<>"'/]/g, match => entityMap[match])
  }

  private _cleanText(text: string) {
    text = text.replace(/<[^>]*>|\[doc\d+\]|<pre[^>]*>.*?<\/pre>|doc\d+|###|\*/g, '')
    return text
  }
}
