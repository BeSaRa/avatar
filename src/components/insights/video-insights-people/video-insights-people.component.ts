import { Component, inject, input, signal } from '@angular/core'
import { InsightsTimelineComponent } from '../../insights-timeline/insights-timeline.component'
import { Face } from '@/contracts/insights'
import { DecimalPipe, NgClass } from '@angular/common'
import { AppearancePercentagePipe } from '../../../pipes/appearance-percentage.pipe'
import { VideoAnalyzerService } from '@/services/video-analyzer.service'
import { LocalService } from '@/services/local.service'

@Component({
  selector: 'app-video-insights-people',
  standalone: true,
  imports: [InsightsTimelineComponent, NgClass, DecimalPipe, AppearancePercentagePipe],
  templateUrl: './video-insights-people.component.html',
  styleUrl: './video-insights-people.component.scss',
})
export class VideoInsightsPeopleComponent {
  people = input.required<Face[]>()
  selectedPerson = signal<Face | undefined>(undefined)
  videoAnalyzer = inject(VideoAnalyzerService)
  lang = inject(LocalService)
}
