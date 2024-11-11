import { SanitizerPipe } from '@/pipes/sanitizer.pipe'
import { LocalService } from '@/services/local.service'
import { VideoIndexerService } from '@/services/video-indexer.service'
import { VideoIndexerTabType } from '@/types/video-indexer-type'
import { NgClass, NgTemplateOutlet } from '@angular/common'
import { Component, computed, inject, signal } from '@angular/core'

@Component({
  selector: 'app-video-indexer',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, SanitizerPipe],
  templateUrl: './video-indexer.component.html',
  styleUrl: './video-indexer.component.scss',
})
export class VideoIndexerComponent {
  lang = inject(LocalService)
  videoIndexerService = inject(VideoIndexerService)
  activeTab = signal<VideoIndexerTabType>('generic')
  frameSources = this.videoIndexerService.buildVideoIndexerUrl()

  activeResource = computed(() => {
    return this.frameSources[this.activeTab()]
  })
  setActiveTab(tabType: VideoIndexerTabType) {
    this.activeTab.set(tabType)
  }
}
