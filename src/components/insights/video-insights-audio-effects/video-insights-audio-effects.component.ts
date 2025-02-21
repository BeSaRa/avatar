import { Component, computed, inject, input, signal } from '@angular/core'
import { InsightsTimelineComponent } from '../../insights-timeline/insights-timeline.component'
import { AudioEffect, InstanceGroup } from '@/contracts/insights'
import { NgClass } from '@angular/common'
import { LocalService } from '@/services/local.service'

@Component({
  selector: 'app-video-insights-audio-effects',
  standalone: true,
  imports: [InsightsTimelineComponent, NgClass],
  templateUrl: './video-insights-audio-effects.component.html',
  styleUrl: './video-insights-audio-effects.component.scss',
})
export class VideoInsightsAudioEffectsComponent {
  audioEffects = input.required<AudioEffect[]>()
  selectedAudioId = signal<number | undefined>(undefined)
  lang = inject(LocalService)
  instances = computed(() => this.audioEffects().find(el => el.id === this.selectedAudioId())?.instances ?? [])
  instanceGroup = computed(() =>
    this.instances().length > 0 ? ([{ instances: this.instances() }] as InstanceGroup[]) : []
  )
}
