import { Component, computed, inject, input, signal } from '@angular/core'
import { InsightsTimelineComponent } from '../../insights-timeline/insights-timeline.component'
import { Label } from '@/contracts/insights'
import { NgClass } from '@angular/common'
import { LocalService } from '@/services/local.service'

@Component({
  selector: 'app-video-insights-labels',
  standalone: true,
  imports: [InsightsTimelineComponent, NgClass],
  templateUrl: './video-insights-labels.component.html',
  styleUrl: './video-insights-labels.component.scss',
})
export class VideoInsightsLabelsComponent {
  labels = input.required<Label[]>()
  selectedLabelId = signal<number | undefined>(undefined)
  instances = computed(() => this.labels().find(el => el.id === this.selectedLabelId())?.instances ?? [])
  lang = inject(LocalService)
}
