import { Component, computed, inject, input, Signal, signal } from '@angular/core'
import { InsightsTimelineComponent } from '../../insights-timeline/insights-timeline.component'
import { InstanceGroup, ObservedPeople } from '@/contracts/insights'
import { DecimalPipe, NgClass, TitleCasePipe } from '@angular/common'
import { populateObservedPeopleData } from '@/utils/insights.utils'
import { AppearancePercentagePipe } from '@/pipes/appearance-percentage.pipe'
import { VideoAnalyzerService } from '@/services/video-analyzer.service'

@Component({
  selector: 'app-video-insights-observed-people',
  standalone: true,
  imports: [InsightsTimelineComponent, NgClass, AppearancePercentagePipe, DecimalPipe, TitleCasePipe],
  templateUrl: './video-insights-observed-people.component.html',
  styleUrl: './video-insights-observed-people.component.scss',
})
export class VideoInsightsObservedPeopleComponent {
  observedPeople = input.required({ transform: populateObservedPeopleData })
  selectedObservedPerson = signal<ObservedPeople | undefined>(undefined)
  instanceGroup: Signal<InstanceGroup[]> = computed(() =>
    this.selectedObservedPerson() ? ([{ instances: this.selectedObservedPerson()?.instances }] as InstanceGroup[]) : []
  )
  videoAnalyzer = inject(VideoAnalyzerService)
}
