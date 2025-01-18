import { Component, inject, output, signal } from '@angular/core'
import { NgClass } from '@angular/common'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import {
  AudioConfig,
  AutoDetectSourceLanguageConfig,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk'
import { AppStore } from '@/stores/app.store'
import { take } from 'rxjs'
import { SpeechService } from '@/services/speech.service'
import { MatTooltip } from '@angular/material/tooltip'
import { LocalService } from '@/services/local.service'

@Component({
  selector: 'app-recorder',
  standalone: true,
  imports: [NgClass, MatTooltip],
  templateUrl: './recorder.component.html',
  styleUrl: './recorder.component.scss',
})
export class RecorderComponent extends OnDestroyMixin(class {}) {
  lang = inject(LocalService)
  declare recognizer: SpeechRecognizer
  store = inject(AppStore)
  recognizingStatus = signal<boolean>(false)
  recognizingText = signal('')
  recognizedText = signal<string>('')
  recognizing$ = output<string>()
  recognized$ = output<string>()
  speechService = inject(SpeechService)

  async toggleRecording() {
    if (this.store.isRecordingLoading()) return
    this.store.isRecordingStarted() && this.recognizer ? await this.stopRecording() : await this.startRecording()
  }

  async stopRecording() {
    if (this.recognizer) {
      this.recognizer.stopContinuousRecognitionAsync(() => {
        this.store.recordingStopped()
        this.cleartext()
      })
    } else {
      this.store.recordingStopped()
    }
  }

  private async startRecording() {
    if (!this.recognizer) {
      await this.prepareRecognizer()
    }

    this.store.recordingInProgress()
    this.recognizer.startContinuousRecognitionAsync(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(this.recognizer.internalData as unknown as any).privConnectionPromise.__zone_symbol__state === true &&
        this.store.recordingStarted()
      this.recognizingStatus.set(true)
    })
  }

  private async prepareRecognizer() {
    // noinspection DuplicatedCode
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput()
    const langDetection = AutoDetectSourceLanguageConfig.fromLanguages(['ar-QA', 'en-US'])

    this.recognizer = SpeechRecognizer.FromConfig(
      // SpeechConfig.fromEndpoint(
      //   new URL('qatarcentral.stt.speech.microsoft.com/speech/recognition/conversation/'),
      //   'b8ed193e693f42f1bfe5f9702865fbbc'
      // ),
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
        this.recognized$.emit(this.recognizedText())
        this.recognizingStatus.set(false)
      }
    }

    this.recognizer.canceled = () => {
      this.store.recordingInProgress()
      this.speechService
        .generateSpeechToken()
        .pipe(take(1))
        .subscribe(() => {
          this.prepareRecognizer().then(() => this.startRecording())
        })
    }
    this.store.recordingStopped()
  }

  cleartext() {
    this.recognizedText.set('')
    this.recognizingText.set('')
  }
}
