import { Component, computed, inject, input, signal } from '@angular/core'
import { InsightsTimelineComponent } from '../../insights-timeline/insights-timeline.component'
import { groupTopics } from '@/utils/insights.utils'
import { Topic } from '@/contracts/insights'
import { NgClass } from '@angular/common'
import { LocalService } from '@/services/local.service'

@Component({
  selector: 'app-video-insights-topics',
  standalone: true,
  imports: [InsightsTimelineComponent, NgClass],
  templateUrl: './video-insights-topics.component.html',
  styleUrl: './video-insights-topics.component.scss',
})
export class VideoInsightsTopicsComponent {
  topics = input.required<Topic[]>()
  selectedTopicId = signal<number | undefined>(undefined)
  groupedTopics = computed(() => groupTopics(this.topics()))
  instances = computed(() => this.topics().find(el => el.id === this.selectedTopicId())?.instances ?? [])

  lang = inject(LocalService)
}
