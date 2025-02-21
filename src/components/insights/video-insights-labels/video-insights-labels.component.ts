import { Component, computed, inject, input, signal } from '@angular/core'
import { InsightsTimelineComponent } from '../../insights-timeline/insights-timeline.component'
import { InstanceGroup, Label } from '@/contracts/insights'
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
  lang = inject(LocalService)
  instances = computed(() => this.labels().find(el => el.id === this.selectedLabelId())?.instances ?? [])
  instanceGroup = computed(() =>
    this.instances().length > 0 ? ([{ instances: this.instances() }] as InstanceGroup[]) : []
  )
  maxItems = 10
  showAll = signal(false)

  visibleLabels = computed(() => (this.showAll() ? this.labels() : this.labels().slice(0, this.maxItems)))
  remainingCount = computed(() => Math.max(this.labels().length - this.maxItems, 0))
}
