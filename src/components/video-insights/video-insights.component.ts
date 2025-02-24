/* eslint-disable max-len */
import { AfterViewInit, Component, ElementRef, inject, input, output, signal, viewChildren } from '@angular/core'
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
import { SupportedLanguageComponent } from '../insights/supported-language/supported-language.component'
import { LocalService } from '@/services/local.service'
import { VideoTimelineComponent } from '../video-timeline/video-timeline.component'

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
    SupportedLanguageComponent,
    VideoTimelineComponent,
  ],
  templateUrl: './video-insights.component.html',
  styleUrl: './video-insights.component.scss',
})
export class VideoInsightsComponent implements AfterViewInit {
  lang = inject(LocalService)
  videoInsights = input.required<VideoInsights>()
  videoSummary = input.required<string>()
  onInsightsLangChange = output<string>()
  activeTab = signal<'INSIGHTS' | 'TIMELINE' | 'SUMMARY'>('INSIGHTS')
  indicatorWidth = signal('0px')
  indicatorTransform = signal('translateX(0)')
  tabs = viewChildren<ElementRef<HTMLButtonElement>>('tab')

  setActiveTab(tab: 'INSIGHTS' | 'TIMELINE' | 'SUMMARY') {
    this.activeTab.set(tab)
    this.updateIndicator()
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateIndicator()
    })
  }

  updateIndicator(): void {
    const tabElements = this.tabs()
    const activeIndex = this.getActiveIndex()
    if (activeIndex !== -1) {
      const tab = tabElements[activeIndex].nativeElement
      this.indicatorWidth.set(`${tab.offsetWidth}px`)
      this.indicatorTransform.set(`translateX(${tab.offsetLeft}px)`)
    }
  }
  getActiveIndex(): number {
    const tabs = ['INSIGHTS', 'TIMELINE', 'SUMMARY']
    return tabs.indexOf(this.activeTab())
  }
}
