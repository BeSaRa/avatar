import { Transcript } from '@/contracts/insights'
import { TimeFormatPipe } from '@/pipes/time-format.pipe'
import { Component, input } from '@angular/core'

@Component({
  selector: 'app-video-timeline',
  standalone: true,
  imports: [TimeFormatPipe],
  templateUrl: './video-timeline.component.html',
  styleUrl: './video-timeline.component.scss',
})
export class VideoTimelineComponent {
  transcript = input.required<Transcript[]>()
}
