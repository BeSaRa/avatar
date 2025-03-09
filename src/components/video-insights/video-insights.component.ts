import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core'
import { VideoInsightsPeopleComponent } from '../insights/video-insights-people/video-insights-people.component'

// eslint-disable-next-line max-len
import { VideoInsightsObservedPeopleComponent } from '../insights/video-insights-observed-people/video-insights-observed-people.component'
import { VideoInsightsTopicsComponent } from '../insights/video-insights-topics/video-insights-topics.component'

// eslint-disable-next-line max-len
import { VideoInsightsAudioEffectsComponent } from '../insights/video-insights-audio-effects/video-insights-audio-effects.component'
import { VideoInsightsLabelsComponent } from '../insights/video-insights-labels/video-insights-labels.component'

import { InsightConfigMap, VideoInsights } from '@/contracts/insights'
import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'

// eslint-disable-next-line max-len
import { VideoInsightsNamedEntitiesComponent } from '../insights/video-insights-named-entities/video-insights-named-entities.component'
import { VideoInsightsEmotionsComponent } from '../insights/video-insights-emotions/video-insights-emotions.component'
import { VideoInsightsScenesComponent } from '../insights/video-insights-scenes/video-insights-scenes.component'
import { SupportedLanguageComponent } from '../insights/supported-language/supported-language.component'
import { LocalService } from '@/services/local.service'
import { VideoTimelineComponent } from '../video-timeline/video-timeline.component'
import { AsyncPipe, KeyValuePipe, NgComponentOutlet } from '@angular/common'
import { VideoAnalyzerService } from '@/services/video-analyzer.service'

@Component({
  selector: 'app-video-insights',
  standalone: true,
  imports: [
    PerfectScrollDirective,
    SupportedLanguageComponent,
    VideoTimelineComponent,
    NgComponentOutlet,
    KeyValuePipe,
    AsyncPipe,
  ],
  templateUrl: './video-insights.component.html',
  styleUrl: './video-insights.component.scss',
})
export class VideoInsightsComponent implements AfterViewInit {
  lang = inject(LocalService)
  videoAnalyzerService = inject(VideoAnalyzerService)
  videoInsights = input.required<VideoInsights>()
  videoSummary = input.required<string>()
  onInsightsLangChange = output<string>()
  activeTab = signal<'INSIGHTS' | 'TIMELINE' | 'SUMMARY'>('INSIGHTS')
  indicatorWidth = signal('0px')
  indicatorTransform = signal('translateX(0)')
  tabs = viewChildren<ElementRef<HTMLButtonElement>>('tab')
  insightsSections = computed<InsightConfigMap | undefined>(() =>
    this.videoInsights() ? this.buildInsights() : undefined
  )

  buildInsights(): InsightConfigMap {
    return {
      people: {
        component: VideoInsightsPeopleComponent,
        inputs: { people: this.videoInsights().faces! },
        show: !!this.videoInsights().faces?.length,
      },
      observedPeople: {
        component: VideoInsightsObservedPeopleComponent,
        inputs: { observedPeople: this.videoInsights().observedPeople! },
        show: !!this.videoInsights().observedPeople?.length,
      },
      topics: {
        component: VideoInsightsTopicsComponent,
        inputs: { topics: this.videoInsights().topics! },
        show: !!this.videoInsights().topics?.length,
      },
      audioEffects: {
        component: VideoInsightsAudioEffectsComponent,
        inputs: { audioEffects: this.videoInsights().audioEffects! },
        show: !!this.videoInsights().audioEffects?.length,
      },
      labels: {
        component: VideoInsightsLabelsComponent,
        inputs: { labels: this.videoInsights().labels! },
        show: !!this.videoInsights().labels?.length,
      },
      namedEntities: {
        component: VideoInsightsNamedEntitiesComponent,
        inputs: {
          brands: this.videoInsights().brands ?? [],
          namedLocations: this.videoInsights().namedLocations ?? [],
          namedPeople: this.videoInsights().namedPeople ?? [],
        },
        show:
          !!this.videoInsights().brands?.length ||
          !!this.videoInsights().namedLocations?.length ||
          !!this.videoInsights().namedPeople?.length,
      },
      emotions: {
        component: VideoInsightsEmotionsComponent,
        inputs: { emotions: this.videoInsights().emotions! },
        show: !!this.videoInsights().emotions?.length,
      },
      scenes: {
        component: VideoInsightsScenesComponent,
        inputs: { scenes: this.videoInsights().scenes, shots: this.videoInsights().shots! },
        show: !!this.videoInsights().scenes.length,
      },
    }
  }
  setActiveTab(tab: 'INSIGHTS' | 'TIMELINE' | 'SUMMARY') {
    this.activeTab.set(tab)
    this.updateIndicator()
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateIndicator()
    }, 200)
  }

  @HostListener('window:resize')
  recalcIndicator() {
    this.updateIndicator()
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

  public readonly originalOrder = (): number => 0
}
