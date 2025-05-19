import { SpinnerLoaderComponent } from '@/components/spinner-loader/spinner-loader.component'
import { AppColors } from '@/constants/app-colors'
import { SVG_ICONS } from '@/constants/svg-icons'
import { ButtonDirective } from '@/directives/button.directive'
import { TextWriterAnimatorDirective } from '@/directives/text-writer-animator.directive'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { SanitizerPipe } from '@/pipes/sanitizer.pipe'
import { AvatarService } from '@/services/avatar.service'
import { ChatHistoryService } from '@/services/chat-history.service'
import { ChatService } from '@/services/chat.service'
import { LocalService } from '@/services/local.service'
import { SpeechService } from '@/services/speech.service'
import { AppStore } from '@/stores/app.store'
import { ignoreErrors } from '@/utils/utils'
import { AsyncPipe, CommonModule } from '@angular/common'
import { Component, computed, effect, ElementRef, inject, Injector, signal, viewChild } from '@angular/core'
import { MatTooltipModule } from '@angular/material/tooltip'
import { Router } from '@angular/router'
import { QRCodeComponent } from 'angularx-qrcode'
import {
  AudioConfig,
  AutoDetectSourceLanguageConfig,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk'
import {
  catchError,
  delay,
  exhaustMap,
  filter,
  from,
  map,
  merge,
  Observable,
  ReplaySubject,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs'
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.js'

@Component({
  selector: 'app-temp-avatar',
  standalone: true,
  host: {
    '[class]': '"block h-full w-full"',
  },
  imports: [
    CommonModule,
    AsyncPipe,
    SanitizerPipe,
    SpinnerLoaderComponent,
    MatTooltipModule,
    ButtonDirective,
    TextWriterAnimatorDirective,
    QRCodeComponent,
  ],
  templateUrl: './temp-avatar.component.html',
  styleUrl: './temp-avatar.component.scss',
  providers: [ChatService],
})
export default class TempAvatarComponent extends OnDestroyMixin(class {}) {
  baseElement = viewChild.required<ElementRef>('baseElement')
  waves = viewChild.required<ElementRef>('waves')
  video = viewChild.required<ElementRef<HTMLVideoElement>>('video')
  idleVideo = viewChild<ElementRef<HTMLVideoElement>>('idleVideo')
  chatContainer = viewChild.required<ElementRef<HTMLDivElement>>('container')

  avatarService = inject(AvatarService)
  lang = inject(LocalService)
  store = inject(AppStore)
  chatService = inject(ChatService)
  chatHistoryService = inject(ChatHistoryService)
  speechService = inject(SpeechService)
  injector = inject(Injector)
  router = inject(Router)

  declare pc: RTCPeerConnection
  declare waveSurfer: WaveSurfer
  declare recorder: RecordPlugin
  declare recognizer: SpeechRecognizer

  readonly svgIcons = SVG_ICONS
  readonly appColors = AppColors

  start$ = new ReplaySubject<void>(1)
  stop$ = new ReplaySubject<void>(1)

  recognizedText = signal<string>('')
  recognizingText = signal<string>('')
  recognized$ = new Subject<void>()
  accept$ = new Subject<void>()
  recognizingStatus = signal<boolean>(false)

  animationStatus = signal(false)
  qrCodeOpened = false

  init$: Observable<unknown> = this.start$
    .asObservable()
    .pipe(tap(() => this.store.updateStreamStatus('InProgress')))
    .pipe(takeUntil(this.destroy$))
    .pipe(
      exhaustMap(() =>
        this.avatarService
          .startStream('life-size')
          .pipe(
            catchError(err => {
              this.store.updateStreamStatus('Stopped') //1
              throw err
            })
          )
          .pipe(ignoreErrors())
      )
    )
    .pipe(
      switchMap(response => {
        const {
          data: {
            webrtcData: { offer, iceServers },
          },
        } = response

        this.pc = new RTCPeerConnection({
          iceServers,
          iceTransportPolicy: 'relay',
        })
        this.pc.addEventListener('icecandidate', event => {
          if (event.candidate) {
            this.avatarService.sendCandidate(event.candidate).subscribe()
          }
        })

        this.pc.addEventListener('icegatheringstatechange', event => {
          if (
            (event.target as unknown as RTCPeerConnection).iceGatheringState == 'complete' &&
            this.video().nativeElement.paused
          ) {
            this.video().nativeElement.play().then()
            this.store.updateStreamStatus('Started')
          }
        })

        this.pc.addEventListener('track', event => {
          this.video().nativeElement.srcObject = event.streams[0]
        })

        this.pc.addEventListener('connectionstatechange', evt => {
          const connectionState = (evt.target as unknown as RTCPeerConnection).connectionState
          if (connectionState === 'connected') {
            this.store.updateStreamStatus('Started')
          }
          if (connectionState === 'disconnected') {
            this.store.updateStreamStatus('Stopped')
          }
        })

        return from(
          this.pc.setRemoteDescription(new RTCSessionDescription(offer as unknown as RTCSessionDescriptionInit))
        )
          .pipe(switchMap(() => from(this.pc.createAnswer())))
          .pipe(switchMap(answer => from(this.pc.setLocalDescription(answer)).pipe(map(() => answer))))
          .pipe(switchMap(answer => this.avatarService.sendAnswer(answer)))
      })
    )
    .pipe(map(() => ''))

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

  async ngOnInit(): Promise<void> {
    // trigger the start of stream
    // this.start$.next()
    // close when destroy component
    this.chatHistoryService
      .getAllBotNames()
      .pipe(tap(names => this.chatService.botNameCtrl.patchValue(names[0])))
      .subscribe()
    this.store.updateStreamStatus('Stopped')
    merge(this.destroy$)
      .pipe(tap(() => this.store.updateStreamStatus('Stopped'))) // 2
      .subscribe(() => {
        console.log('COMPONENT DESTROYED')
      })

    this.stop$
      .pipe(filter(() => this.store.hasStream()))
      .pipe(tap(() => this.store.updateStreamStatus('Disconnecting')))
      .pipe(takeUntil(this.destroy$))
      .pipe(switchMap(() => this.avatarService.closeStream().pipe(ignoreErrors())))
      .subscribe(() => {
        this.store.updateStreamStatus('Stopped')
        console.log('MANUAL CLOSE')
        this.store.updateStreamStatus('Stopped')
      })

    this.start$.next()

    this.listenToAccept()
    this.listenToBotNameChange()
    this.prepareRecorder()
  }

  ngAfterViewInit(): void {
    this.playIdle()
    // effect(
    //   () => {
    //     new PerfectScrollbar(this.chatContainer().nativeElement, {})
    //   },
    //   { injector: this.injector }
    // )
  }

  toggleStream() {
    if (this.store.isStreamLoading()) return

    this.store.isStreamStopped() ? this.start$.next() : this.stop$.next()
  }

  interruptAvatar() {
    this.avatarService.interruptAvatar().pipe(take(1)).subscribe()
  }

  clearChat() {
    this.chatService.messages.set([])
  }

  startRecording() {
    this.store.recordingInProgress()
    this.recognizer.startContinuousRecognitionAsync(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(this.recognizer.internalData as unknown as any).privConnectionPromise.__zone_symbol__state === true &&
        this.store.recordingStarted()
      this.recognizingStatus.set(true)
    })
  }

  stopRecording() {
    this.recognizer.stopContinuousRecognitionAsync(() => {
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
    this.accept$.next()
  }

  rejectText() {
    this.recognizingText.set('')
    this.recognizedText.set('')
    this.recognizingStatus.set(false)
    this.stopRecording()
  }

  private goToEndOfChat() {
    setTimeout(() => {
      const messagesList = this.chatContainer().nativeElement.querySelectorAll('.user')
      messagesList[messagesList.length - 1].scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  private prepareRecorder() {
    this.waveSurfer = new WaveSurfer({
      waveColor: 'white',
      progressColor: 'white',
      container: this.waves().nativeElement,
      height: 'auto',
    })

    this.recorder = this.waveSurfer.registerPlugin(RecordPlugin.create({ scrollingWaveform: false }))
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(recStream => this.recorder.renderMicStream(recStream))

    const audioConfig = AudioConfig.fromDefaultMicrophoneInput()
    const langDetection = AutoDetectSourceLanguageConfig.fromLanguages(['ar-QA', 'en-US'])

    this.recognizer = SpeechRecognizer.FromConfig(
      SpeechConfig.fromAuthorizationToken(this.store.speechToken.token(), this.store.speechToken.region()),
      langDetection,
      audioConfig
    )
    // recognizing event
    this.recognizer.recognizing = (_rec, event) => {
      if (event.result.reason === ResultReason.RecognizingSpeech) {
        this.recognizingText.set(this.recognizedText() + ' ' + event.result.text)
        this.recognizingStatus.set(true)
      }
    }
    // recognized event
    this.recognizer.recognized = (_rec, event) => {
      if (event.result.reason === ResultReason.RecognizedSpeech && this.store.isRecordingStarted()) {
        this.recognizedText.update(text => text + ' ' + event.result.text)
        this.recognized$.next()
        this.recognizingStatus.set(false)
      }
    }

    this.recognizer.canceled = () => {
      this.store.recordingInProgress()
      this.speechService
        .generateSpeechToken()
        .pipe(take(1))
        .subscribe(() => {
          this.prepareRecorder()
          this.startRecording()
        })
    }
  }

  private listenToAccept() {
    this.accept$
      .pipe(map(() => this.recognizedText()))
      .pipe(filter(value => !!value))
      .pipe(takeUntil(this.destroy$))
      .pipe(
        tap(() => {
          this.recognizedText.set('')
          this.recognizingText.set('')
          this.recognizingStatus.set(false)
          this.stopRecording()
        })
      )
      .pipe(tap(() => this.goToEndOfChat()))
      .pipe(exhaustMap(value => this.chatService.sendMessage(value, this.chatService.botNameCtrl.value)))
      .pipe(delay(200))
      .subscribe(() => {
        const assistantList = this.chatContainer().nativeElement.querySelectorAll('.assistant')
        const effectCallback = effect(
          () => {
            if (!this.animationStatus()) {
              assistantList[assistantList.length - 1].scrollIntoView({ behavior: 'smooth' })
              effectCallback.destroy()
            }
          },
          { injector: this.injector }
        )
      })
  }

  listenToBotNameChange() {
    this.chatService.onBotNameChange().pipe(takeUntil(this.destroy$)).subscribe()
  }

  toggleFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().then()
    } else {
      this.baseElement().nativeElement.requestFullscreen().then()
    }
  }

  isFullScreen() {
    return !!document.fullscreenElement
  }

  getQRData() {
    return `${this.getOrigin()}/control?streamId=${this.store.streamId()}`
  }

  getOrigin() {
    const idx = location.href.lastIndexOf(this.router.url)
    return location.href.slice(0, idx)
  }

  private playIdle(): void {
    if (this.idleVideo() && this.idleVideo()?.nativeElement) {
      this.idleVideo()!.nativeElement.src = this.store.idleAvatarUrl()
      this.idleVideo()!.nativeElement.muted = true
      this.idleVideo()!.nativeElement.loop = true
      this.idleVideo()!.nativeElement.play().then()
    }
  }
}
