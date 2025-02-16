import { Component } from '@angular/core'
import { InsightsTimelineComponent } from '../../insights-timeline/insights-timeline.component'

@Component({
  selector: 'app-video-insights-named-entities',
  standalone: true,
  imports: [InsightsTimelineComponent],
  templateUrl: './video-insights-named-entities.component.html',
  styleUrl: './video-insights-named-entities.component.scss',
})
export class VideoInsightsNamedEntitiesComponent {}
