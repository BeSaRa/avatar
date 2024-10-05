import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
  output,
  input,
  effect,
  Injector,
  computed,
} from '@angular/core'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { AppStore } from '@/stores/app.store'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { NgClass } from '@angular/common'
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
import { MatRipple } from '@angular/material/core'
import { delay, take } from 'rxjs'
import { OverlayChatComponent } from '@/components/overlay-chat/overlay-chat.component'

@Component({
  selector: 'app-screen-control',
  standalone: true,
  imports: [CdkDrag, CdkDragHandle, NgClass, MatRipple],
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
          backgroundColor: 'red',
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
export class ScreenControlComponent implements OnInit {
  avatarVideoComponent = input.required<AvatarVideoComponent>()
  overlayChatComponent = input.required<OverlayChatComponent>()
  waves = viewChild.required<ElementRef>('waves')
  store = inject(AppStore)
  chatService = inject(ChatService)
  injector = inject(Injector)
  declare recordingStream: MediaStream
  declare waveSurfer: WaveSurfer
  declare recorder: RecordPlugin
  declare recognizer: SpeechRecognizer
  fullscreen = output<void>()
  recognizedText = signal<string>('')
  recognizingText = signal<string>('')
  noRecognized = computed(() => !this.recognizedText().length)
  recognizing$ = output<string>()

  async ngOnInit(): Promise<void> {
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
      }
    }
    // recognized event
    this.recognizer.recognized = (_rec, event) => {
      if (event.result.reason === ResultReason.RecognizedSpeech && this.store.isRecordingStarted()) {
        this.recognizedText.update(text => text + event.result.text)
      }
    }
  }

  startRecording() {
    this.store.recordingInProgress()
    this.recognizer.startContinuousRecognitionAsync(() => {
      this.store.recordingStarted()
    })
  }

  stopRecording() {
    this.recognizer.stopContinuousRecognitionAsync(() => {
      this.store.recordingStopped()
    })
  }

  startStream() {
    this.avatarVideoComponent().start$.next()
  }

  stopStream() {
    this.avatarVideoComponent().stop$.next()
  }

  toggleRecording() {
    if (this.store.isRecordingStarted()) {
      this.acceptText()
    } else {
      this.startRecording()
    }
  }

  acceptText() {
    this.chatService
      .sendMessage(this.recognizedText())
      .pipe(take(1))
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
    this.recognizedText.set('')
    this.recognizingText.set('')
    this.recognizing$.emit('')
    this.stopRecording()
  }

  rejectText() {
    this.recognizingText.set('')
    this.recognizedText.set('')
    this.recognizing$.emit('')
    this.stopRecording()
  }
}
