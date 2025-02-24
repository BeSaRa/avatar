import { Directive, ElementRef, OnChanges, SimpleChanges, AfterViewInit, input } from '@angular/core'

@Directive({
  selector: '[appSyncVideoAudio]',
  standalone: true,
})
export class SyncVideoAudioDirective implements AfterViewInit, OnChanges {
  videoUrl = input.required<string>()
  audioUrl = input.required<string>()

  private mediaSource!: MediaSource
  private videoSourceBuffer!: SourceBuffer
  private audioContext!: AudioContext
  private audioBuffer!: AudioBuffer
  private audioBufferSource!: AudioBufferSourceNode | null
  private isPlaying = false // Track playback state

  constructor(private el: ElementRef<HTMLVideoElement>) {}

  ngAfterViewInit() {
    if (this.videoUrl() && this.audioUrl()) {
      this.initializeStreaming()
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['videoUrl'] && this.videoUrl()) || (changes['audioUrl'] && this.audioUrl())) {
      this.initializeStreaming()
    }
  }

  private initializeStreaming() {
    if (!this.videoUrl() || !this.audioUrl()) return

    const videoElement = this.el.nativeElement
    this.mediaSource = new MediaSource()
    videoElement.src = URL.createObjectURL(this.mediaSource)

    this.mediaSource.addEventListener('sourceopen', async () => {
      await this.setupMediaStreaming()
    })

    videoElement.addEventListener('play', () => this.playAudio())
    videoElement.addEventListener('pause', () => this.stopAudio())
    videoElement.addEventListener('seeking', () => this.syncAudioToVideo())
    videoElement.addEventListener('ratechange', () => this.adjustPlaybackRate())
  }

  private async setupMediaStreaming() {
    const videoMimeType = 'video/mp4; codecs="avc1.64001E"'
    const audioMimeType = 'audio/mp4; codecs="mp4a.40.2"'

    if (MediaSource.isTypeSupported(videoMimeType)) {
      this.videoSourceBuffer = this.mediaSource.addSourceBuffer(videoMimeType)
      await this.streamVideo(this.videoUrl(), this.videoSourceBuffer)
    } else {
      console.error('Video format not supported')
    }

    if (MediaSource.isTypeSupported(audioMimeType)) {
      this.audioContext = new AudioContext()
      this.audioBuffer = await this.fetchAndDecodeAudio(this.audioUrl())
    } else {
      console.error('Audio format not supported')
    }
  }

  private async streamVideo(url: string, sourceBuffer: SourceBuffer) {
    const response = await fetch(url)
    const reader = response.body!.getReader()

    const readChunk = async () => {
      const { done, value } = await reader.read()
      if (done) {
        this.mediaSource.endOfStream()
        return
      }

      if (!sourceBuffer.updating) {
        sourceBuffer.appendBuffer(value)
      }

      sourceBuffer.addEventListener('updateend', readChunk)
    }

    readChunk()
  }

  private async fetchAndDecodeAudio(url: string): Promise<AudioBuffer> {
    const response = await fetch(url)
    const data = await response.arrayBuffer()
    return await this.audioContext.decodeAudioData(data)
  }

  private playAudio() {
    if (!this.audioBuffer) return

    // Stop existing audio before starting a new one
    this.stopAudio()

    this.audioBufferSource = this.audioContext.createBufferSource()
    this.audioBufferSource.buffer = this.audioBuffer
    this.audioBufferSource.connect(this.audioContext.destination)
    this.audioBufferSource.start(0, this.el.nativeElement.currentTime)

    this.isPlaying = true
  }

  private stopAudio() {
    if (this.audioBufferSource) {
      this.audioBufferSource.stop()
      this.audioBufferSource.disconnect()
      this.audioBufferSource = null // Ensure it's fully reset
    }

    this.isPlaying = false
  }

  private syncAudioToVideo() {
    if (this.isPlaying) {
      this.stopAudio()
      this.playAudio()
    }
  }

  private adjustPlaybackRate() {
    if (this.audioBufferSource) {
      this.audioBufferSource.playbackRate.value = this.el.nativeElement.playbackRate
    }
  }
}
