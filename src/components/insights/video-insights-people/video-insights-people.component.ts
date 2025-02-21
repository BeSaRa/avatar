import { Component, computed, inject, input, Signal, signal } from '@angular/core'
import { InsightsTimelineComponent } from '../../insights-timeline/insights-timeline.component'
import { Face, InstanceGroup } from '@/contracts/insights'
import { DecimalPipe, NgClass, PercentPipe } from '@angular/common'
import { AppearancePercentagePipe } from '../../../pipes/appearance-percentage.pipe'
import { VideoAnalyzerService } from '@/services/video-analyzer.service'
import { LocalService } from '@/services/local.service'
import { MatTooltip } from '@angular/material/tooltip'

@Component({
  selector: 'app-video-insights-people',
  standalone: true,
  imports: [InsightsTimelineComponent, NgClass, DecimalPipe, AppearancePercentagePipe, MatTooltip, PercentPipe],
  templateUrl: './video-insights-people.component.html',
  styleUrl: './video-insights-people.component.scss',
})
export class VideoInsightsPeopleComponent {
  people = input.required<Face[]>()
  selectedPerson = signal<Face | undefined>(undefined)
  instanceGroup: Signal<InstanceGroup[]> = computed(() =>
    this.selectedPerson() ? ([{ instances: this.selectedPerson()?.instances }] as InstanceGroup[]) : []
  )
  showBiography = signal(false)

  videoAnalyzer = inject(VideoAnalyzerService)
  lang = inject(LocalService)

  toggleDescription() {
    this.showBiography.update(() => !this.showBiography())
  }
}
