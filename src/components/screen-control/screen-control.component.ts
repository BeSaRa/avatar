import {
  Component,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { AppStore } from '@/stores/app.store'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { AsyncPipe, NgClass } from '@angular/common'
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/plugins/record'
import {
  AudioConfig,
  AutoDetectSourceLanguageConfig,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk'
import { ChatService } from '@/services/chat.service'
import { AvatarVideoComponent } from '@/components/avatar-video/avatar-video.component'
import { AvatarInterrupterBtnComponent } from '@/components/avatar-interrupter-btn/avatar-interrupter-btn.component'
import { MatRipple } from '@angular/material/core'
import { delay, exhaustMap, filter, map, Subject, take, takeUntil, tap } from 'rxjs'
import { OverlayChatComponent } from '@/components/overlay-chat/overlay-chat.component'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { SpeechService } from '@/services/speech.service'
import { AvatarService } from '@/services/avatar.service'
import { MatTooltip } from '@angular/material/tooltip'
import { LocalService } from '@/services/local.service'
import { ChatHistoryService } from '@/services/chat-history.service'
import { ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-screen-control',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDragHandle,
    NgClass,
    MatRipple,
    MatTooltip,
    AvatarInterrupterBtnComponent,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './screen-control.component.html',
  styleUrl: './screen-control.component.scss',
  animations: [
    trigger('recordButton', [
      state(
        'InProgress',
        style({
          transform: 'scale(1)',
          backgroundColor: 'gray',
        })
      ),
      state(
        'Started',
        style({
          transform: 'scale(1)',
        })
      ),
      state(
        'Stopped',
        style({
          transform: 'scale(0)',
        })
      ),
      transition('* <=> *', [animate('150ms ease-in-out')]),
    ]),
  ],
})
export class ScreenControlComponent extends OnDestroyMixin(class {}) implements OnInit {
  avatarVideoComponent = input.required<AvatarVideoComponent>()
  overlayChatComponent = input.required<OverlayChatComponent>()
  waves = viewChild.required<ElementRef>('waves')
  store = inject(AppStore)
  chatService = inject(ChatService)
  chatHistoryService = inject(ChatHistoryService)
  avatarService = inject(AvatarService)
  injector = inject(Injector)
  declare recordingStream: MediaStream
  declare waveSurfer: WaveSurfer
  declare recorder: RecordPlugin
  declare recognizer: SpeechRecognizer
  fullscreen = output<void>()
  recognizedText = signal<string>('')
  recognizingText = signal<string>('')
  speechService = inject(SpeechService)
  recognizing$ = output<string>()
  recognized$ = new Subject<void>()
  accept$ = new Subject<void>()
  recognizingStatus = signal<boolean>(false)
  botNames$ = this.chatHistoryService.getAllBotNames()

  settingsOpened = false
  lang = inject(LocalService)

  async ngOnInit(): Promise<void> {
    this.listenToAccept()
    this.listenToBotNameChange()
    await this.prepareRecorder()
  }

  listenToBotNameChange() {
    this.chatService.onBotNameChange().pipe(takeUntil(this.destroy$)).subscribe()
  }
  private async prepareRecorder() {
    this.recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    this.waveSurfer = new WaveSurfer({
      waveColor: 'white',
      progressColor: 'white',
      container: this.waves().nativeElement,
      height: 'auto',
    })
    this.recorder = this.waveSurfer.registerPlugin(RecordPlugin.create({ scrollingWaveform: false }))

    this.recorder.renderMicStream(this.recordingStream)

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
        this.recognizing$.emit(this.recognizingText())
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
          this.prepareRecorder().then(() => this.startRecording())
        })
    }
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
    this.recognizing$.emit('')
    this.recognizingStatus.set(false)
    this.stopRecording()
  }

  private goToEndOfChat() {
    setTimeout(() => {
      const messagesList = this.overlayChatComponent().container().nativeElement.querySelectorAll('.user')
      messagesList[messagesList.length - 1].scrollIntoView(true)
    }, 100)
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
          this.recognizing$.emit('')
          this.stopRecording()
        })
      )
      .pipe(tap(() => this.goToEndOfChat()))
      .pipe(exhaustMap(value => this.chatService.sendMessage(value, this.chatService.botNameCtrl.value)))
      .pipe(delay(200))
      .subscribe(() => {
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

  clearChat() {
    this.chatService.messages.set([])
  }

  toggleStream() {
    if (this.store.isStreamLoading()) return

    this.store.isStreamStopped() ? this.avatarVideoComponent().start$.next() : this.avatarVideoComponent().stop$.next()
  }

  toggleSettings() {
    this.settingsOpened = !this.settingsOpened
  }
}
