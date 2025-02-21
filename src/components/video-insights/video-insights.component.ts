/* eslint-disable max-len */
import { Component, input } from '@angular/core'
import { VideoInsightsPeopleComponent } from '../insights/video-insights-people/video-insights-people.component'

import { VideoInsightsObservedPeopleComponent } from '../insights/video-insights-observed-people/video-insights-observed-people.component'
import { VideoInsightsTopicsComponent } from '../insights/video-insights-topics/video-insights-topics.component'

import { VideoInsightsAudioEffectsComponent } from '../insights/video-insights-audio-effects/video-insights-audio-effects.component'
import { VideoInsightsLabelsComponent } from '../insights/video-insights-labels/video-insights-labels.component'

import { VideoInsights } from '@/contracts/insights'
import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'

import { VideoInsightsNamedEntitiesComponent } from '../insights/video-insights-named-entities/video-insights-named-entities.component'
import { VideoInsightsEmotionsComponent } from '../insights/video-insights-emotions/video-insights-emotions.component'
import { VideoInsightsScenesComponent } from '../insights/video-insights-scenes/video-insights-scenes.component'

@Component({
  selector: 'app-video-insights',
  standalone: true,
  imports: [
    VideoInsightsPeopleComponent,
    VideoInsightsObservedPeopleComponent,
    VideoInsightsTopicsComponent,
    VideoInsightsAudioEffectsComponent,
    VideoInsightsLabelsComponent,
    PerfectScrollDirective,
    VideoInsightsNamedEntitiesComponent,
    VideoInsightsEmotionsComponent,
    VideoInsightsScenesComponent,
  ],
  templateUrl: './video-insights.component.html',
  styleUrl: './video-insights.component.scss',
})
export class VideoInsightsComponent {
  videoInsights = input.required<VideoInsights>()
}
