import { Component } from '@angular/core'
import { InsightsTimelineComponent } from '../../insights-timeline/insights-timeline.component'

@Component({
  selector: 'app-video-insights-emotions',
  standalone: true,
  imports: [InsightsTimelineComponent],
  templateUrl: './video-insights-emotions.component.html',
  styleUrl: './video-insights-emotions.component.scss',
})
export class VideoInsightsEmotionsComponent {}
