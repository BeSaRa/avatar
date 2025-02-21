import { Component, computed, inject, input, Signal, signal } from '@angular/core'
import { InsightsTimelineComponent } from '../../insights-timeline/insights-timeline.component'
import { Brand, InstanceGroup, NamedLocation, NamedPeople } from '@/contracts/insights'
import { DecimalPipe, JsonPipe, NgClass, NgTemplateOutlet, PercentPipe } from '@angular/common'
import { LocalService } from '@/services/local.service'
import { AppearancePercentagePipe } from '@/pipes/appearance-percentage.pipe'
import { MatTooltip } from '@angular/material/tooltip'
import { VideoAnalyzerService } from '@/services/video-analyzer.service'

@Component({
  selector: 'app-video-insights-named-entities',
  standalone: true,
  imports: [
    InsightsTimelineComponent,
    NgClass,
    NgTemplateOutlet,
    JsonPipe,
    AppearancePercentagePipe,
    MatTooltip,
    DecimalPipe,
    PercentPipe,
  ],
  templateUrl: './video-insights-named-entities.component.html',
  styleUrl: './video-insights-named-entities.component.scss',
})
export class VideoInsightsNamedEntitiesComponent {
  lang = inject(LocalService)
  videoAnalyzer = inject(VideoAnalyzerService)
  brands = input.required<Brand[]>()
  namedLocations = input.required<NamedLocation[]>()
  namedPeople = input.required<NamedPeople[]>()
  selectedEntity = signal<Brand | NamedLocation | NamedPeople | undefined>(undefined)
  selectedEntityType = signal<'BRAND' | 'LOCATION' | 'PEOPLE' | undefined>(undefined)
  showDescription = signal(false)
  instanceGroup = computed(() =>
    this.selectedEntity() ? ([{ instances: this.selectedEntity()?.instances }] as InstanceGroup[]) : []
  )
  maxItems = 10
  showAll = signal<Record<string, boolean>>({
    BRAND: false,
    LOCATION: false,
    PEOPLE: false,
  })

  toggleShowAll(listKey: 'BRAND' | 'LOCATION' | 'PEOPLE') {
    this.showAll.update(state => ({ ...state, [listKey]: true }))
  }

  // Computed signals for visible items
  visibleEntities: Record<string, Signal<(Brand | NamedLocation | NamedPeople)[]>> = {
    BRAND: computed(() => (this.showAll()['BRAND'] ? this.brands() : this.brands().slice(0, this.maxItems))),
    LOCATION: computed(() =>
      this.showAll()['LOCATION'] ? this.namedLocations() : this.namedLocations().slice(0, this.maxItems)
    ),
    PEOPLE: computed(() =>
      this.showAll()['PEOPLE'] ? this.namedPeople() : this.namedPeople().slice(0, this.maxItems)
    ),
  }

  // Computed signals for remaining items
  remainingCount: Record<string, Signal<number>> = {
    BRAND: computed(() => Math.max(this.brands().length - this.maxItems, 0)),
    LOCATION: computed(() => Math.max(this.namedLocations().length - this.maxItems, 0)),
    PEOPLE: computed(() => Math.max(this.namedPeople().length - this.maxItems, 0)),
  }

  entitiesCount = computed(() =>
    [this.brands(), this.namedLocations(), this.namedPeople()]
      .map(el => el?.length ?? 0)
      .reduce((acc, curr) => acc + curr, 0)
  )

  toggleDescription() {
    this.showDescription.update(() => !this.showDescription())
  }
}
