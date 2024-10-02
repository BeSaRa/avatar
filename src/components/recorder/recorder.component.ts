import { Component, computed, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core'
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/plugins/record'
import {
  AudioConfig,
  AutoDetectSourceLanguageConfig,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk'
import { AppStore } from '@/stores/app.store'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { NgClass } from '@angular/common'

@Component({
  selector: 'app-recorder',
  standalone: true,
  imports: [NgClass],
  templateUrl: './recorder.component.html',
  styleUrl: './recorder.component.scss',
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
export class RecorderComponent implements OnInit {
  waves = viewChild.required<ElementRef>('waves')
  recordStatus = signal<'InProgress' | 'Started' | 'Stopped'>('Stopped')
  isStarted = computed(() => {
    return this.recordStatus() === 'Started'
  })

  isStopped = computed(() => {
    return this.recordStatus() === 'Stopped'
  })

  isProgressed = computed(() => {
    return this.recordStatus() === 'InProgress'
  })

  waveSurfer?: WaveSurfer
  recorder?: RecordPlugin
  stream?: MediaStream
  store = inject(AppStore)
  recognizer?: SpeechRecognizer
  recognizedText = signal<string>('')
  audioConfig?: AudioConfig
  langDetection?: AutoDetectSourceLanguageConfig

  async ngOnInit(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    this.waveSurfer = new WaveSurfer({
      waveColor: 'white',
      progressColor: 'white',
      container: this.waves().nativeElement,
      height: 'auto',
    })
    this.recorder = this.waveSurfer.registerPlugin(RecordPlugin.create({ scrollingWaveform: false }))

    this.recorder.renderMicStream(this.stream)

    this.audioConfig = AudioConfig.fromDefaultMicrophoneInput()
    this.langDetection = AutoDetectSourceLanguageConfig.fromLanguages(['ar-QA', 'en-US'])

    this.recognizer = SpeechRecognizer.FromConfig(
      SpeechConfig.fromAuthorizationToken(this.store.speechToken.token(), this.store.speechToken.region()),
      this.langDetection!,
      this.audioConfig
    )
    // recognizing event
    this.recognizer.recognizing = (_rec, event) => {
      if (event.result.reason === ResultReason.RecognizingSpeech) {
        this.recognizedText.set(event.result.text)
      }
    }
    // recognized event
    this.recognizer.recognized = (_rec, event) => {
      if (event.result.reason === ResultReason.RecognizedSpeech) {
        this.recognizedText.set(event.result.text)
      }
    }
  }

  async toggleRecord() {
    if (this.isStarted() || this.isProgressed()) {
      await this.stopRecording()
    } else {
      await this.startRecording()
    }
  }

  private async startRecording() {
    this.recordStatus.set('InProgress')
    if (!this.recognizer) {
      return
    }
    // establish connection with ms sdk
    this.recognizer.startContinuousRecognitionAsync(async () => {
      if (this.isProgressed()) {
        // this.recorder?.resumeRecording()
        this.recordStatus.set('Started')
      } else {
        await this.stopRecording()
      }
    })
  }

  private async stopRecording() {
    this.recordStatus.set('Stopped')
    //this.stream?.getTracks()?.forEach(track => track.stop())
    this.recognizer?.stopContinuousRecognitionAsync()
  }
}
