import { Component, computed, inject, input } from '@angular/core'
import { InsightsTimelineComponent } from '../../insights-timeline/insights-timeline.component'
import { Emotion, EmotionType, InstanceGroup } from '@/contracts/insights'
import { TailwindColorWithShade } from '@/types/tailwind-colors-type'
import { VideoAnalyzerService } from '@/services/video-analyzer.service'
import { AppearancePercentagePipe } from '@/pipes/appearance-percentage.pipe'
import { DecimalPipe, NgClass } from '@angular/common'
import { LocalService } from '@/services/local.service'

@Component({
  selector: 'app-video-insights-emotions',
  standalone: true,
  imports: [InsightsTimelineComponent, AppearancePercentagePipe, DecimalPipe, NgClass],
  templateUrl: './video-insights-emotions.component.html',
  styleUrl: './video-insights-emotions.component.scss',
})
export class VideoInsightsEmotionsComponent {
  lang = inject(LocalService)
  videoAnalyzer = inject(VideoAnalyzerService)
  emotions = input.required<Emotion[]>()
  colorMap: Record<
    EmotionType,
    {
      text: `text-${TailwindColorWithShade}`
      bg: `bg-${TailwindColorWithShade}`
      fill: `fill-${TailwindColorWithShade}`
    }
  > = {
    Anger: {
      text: 'text-red-600',
      bg: 'bg-red-600',
      fill: 'fill-red-600',
    },
    Fear: {
      text: 'text-purple-700',
      bg: 'bg-purple-700',
      fill: 'fill-purple-700',
    },
    Joy: {
      text: 'text-yellow-400',
      bg: 'bg-yellow-400',
      fill: 'fill-yellow-400',
    },
    Neutral: {
      text: 'text-gray-400',
      bg: 'bg-gray-400',
      fill: 'fill-gray-400',
    },
    Sad: {
      text: 'text-blue-500',
      bg: 'bg-blue-500',
      fill: 'fill-blue-500',
    },
  }

  translateMap: Record<EmotionType, string> = {
    Anger: this.lang.locals.anger,
    Fear: this.lang.locals.fear,
    Joy: this.lang.locals.joy,
    Sad: this.lang.locals.sad,
    Neutral: this.lang.locals.neutral,
  }

  instanceGroup = computed(() => {
    return this.emotions().map(
      emotion =>
        ({
          instanceColor: this.colorMap[emotion.type].fill,
          instanceTooltipColor: this.colorMap[emotion.type].bg,
          instances: emotion.instances,
        }) as InstanceGroup
    )
  })
}
