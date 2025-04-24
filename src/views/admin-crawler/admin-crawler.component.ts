import { CommonModule, DOCUMENT, NgClass } from '@angular/common'
import { Component, inject, Injector, OnInit, runInInjectionContext, signal } from '@angular/core'
import { FormArray, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatTabsModule } from '@angular/material/tabs'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { finalize, takeUntil, tap } from 'rxjs'
import { LocalService } from '@/services/local.service'
import { AdminService } from '@/services/admin.service'
import { SettingsFormComponent } from '../../components/settings-form/settings-form.component'
import { MatDialog } from '@angular/material/dialog'
import { AddUrlPopupComponent } from '@/components/add-url-popup/add-url-popup.component'
import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { UrlSummaryCardComponent } from '../../components/url-summary-card/url-summary-card.component'
import {
  CrawlerSettingGroup,
  createCrawlerSettingsGroup,
  createKeyValuePair,
  createUrlGroup,
  UrlGroup,
  UrlGroupRawValue,
} from '@/types/url-crawler'
import { JsonPreviewerPopupComponent } from '@/components/json-previewer-popup/json-previewer-popup.component'
import { transformData } from '@/utils/utils'
import { searchAnimation } from '@/animations/search-animation'
import { CrawlUrlContract } from '@/contracts/settings-contract'

@Component({
  selector: 'app-admin-crawler',
  standalone: true,
  imports: [
    MatTabsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    SettingsFormComponent,
    CommonModule,
    PerfectScrollDirective,
    UrlSummaryCardComponent,
    NgClass,
  ],
  templateUrl: './admin-crawler.component.html',
  styleUrls: ['./admin-crawler.component.scss'],
  animations: [searchAnimation],
})
export class AdminCrawlerComponent extends OnDestroyMixin(class {}) implements OnInit {
  crawlerForm = inject(NonNullableFormBuilder).array<CrawlerSettingGroup>([])
  doc = inject(DOCUMENT)
  lang = inject(LocalService)
  injector = inject(Injector)
  adminService = inject(AdminService)
  dialog = inject(MatDialog)
  selectedTab = signal<'urls' | 'settings'>('urls')
  urlsSignal = signal(this.crawlerForm.controls)
  isloading = signal(false)
  declare urlGroupByDays: Record<number, CrawlerSettingGroup[]>

  constructor() {
    super()
  }

  ngOnInit(): void {
    this.adminService
      .getCrawlingData()
      .pipe(
        takeUntil(this.destroy$),
        tap(items => {
          items.forEach(item => {
            const urlSettings = this.createUrlSettings(item)
            this.crawlerForm.push(urlSettings)
          })
          this.updateUrlGroup()
        })
      )
      .subscribe()
  }

  // Form Array Accessors
  urlsArray(urlIndex: number): FormArray<UrlGroup> {
    return this.crawlerForm.at(urlIndex).get('crawl_settings')?.get('urls') as FormArray<UrlGroup>
  }

  // Utility methods for adding controls dynamically
  addUrl(): void {
    this.dialog
      .open<AddUrlPopupComponent, undefined, UrlGroup>(AddUrlPopupComponent, {
        width: '70vw',
      })
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        tap(res => {
          if (res) {
            const newUrlSettings = runInInjectionContext(this.injector, () => createCrawlerSettingsGroup())
            newUrlSettings.controls.crawl_days.patchValue(res.value.settings?.schedule_by_days)
            this.crawlerForm.push(newUrlSettings)
            this.urlsArray(-1).push(res)
            this.updateUrlGroup()
          }
        })
      )
      .subscribe()
  }

  removeUrl(index: number, groupIndex: number, groupKey: number) {
    this.urlGroupByDays[groupKey].splice(groupIndex, 1)
    this.crawlerForm.removeAt(index)
    if (!this.urlGroupByDays[groupKey].length) {
      delete this.urlGroupByDays[groupKey]
    }
  }

  previewJson() {
    this.dialog.open<JsonPreviewerPopupComponent<CrawlUrlContract[]>, CrawlUrlContract[], boolean>(
      JsonPreviewerPopupComponent,
      {
        data: transformData(this.crawlerForm.getRawValue()),
      }
    )
  }
  startCrawling() {
    this.isloading.set(true)
    const formattedValue = transformData(this.crawlerForm.getRawValue())
    this.adminService
      .scheduleUrl(formattedValue, this.lang.locals.save_urls_successfully)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isloading.set(false))
      )
      .subscribe()
  }

  groupByCrawlDays(): Record<number, CrawlerSettingGroup[]> {
    const grouped = this.crawlerForm.controls.reduce(
      (acc, item) => {
        const day = item.value.crawl_days!
        ;(acc[day] ||= []).push(item)
        return acc
      },
      {} as Record<number, CrawlerSettingGroup[]>
    )

    // Sort the keys and return a new ordered object
    return Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b)
      .reduce(
        (ordered, key) => {
          ordered[key] = grouped[key]
          return ordered
        },
        {} as Record<number, CrawlerSettingGroup[]>
      )
  }

  createKeyValuePairs(obj?: Record<string, string>): { key: string; value: string }[] {
    return obj ? Object.entries(obj).map(([key, value]) => ({ key, value })) : []
  }

  createUrlGroupWithData(urlData: UrlGroupRawValue): UrlGroup {
    const urlGroup = runInInjectionContext(this.injector, () => createUrlGroup())
    urlGroup.patchValue({
      link: urlData.link,
      settings: urlData.settings,
    })

    // fill headers
    urlData.headers.forEach(pair => {
      const kv = runInInjectionContext(this.injector, () => createKeyValuePair())
      kv.patchValue(pair)
      urlGroup.controls.headers.push(kv)
    })
    // fill cookies
    urlData.cookies.forEach(pair => {
      const kv = runInInjectionContext(this.injector, () => createKeyValuePair())
      kv.patchValue(pair)
      urlGroup.controls.cookies.push(kv)
    })
    // fill payload
    urlData.payload.forEach(pair => {
      const kv = runInInjectionContext(this.injector, () => createKeyValuePair())
      kv.patchValue(pair)
      urlGroup.controls.payload.push(kv)
    })

    return urlGroup
  }

  createUrlSettings(item: CrawlUrlContract): CrawlerSettingGroup {
    const settingsGroup = runInInjectionContext(this.injector, () => createCrawlerSettingsGroup())
    settingsGroup.patchValue({
      last_crawl: item.last_crawl,
      crawl_days: item.crawl_days ?? item.crawl_settings.urls.at(0)!.settings.schedule_by_days,
      crawling_status: item.crawling_status,
    })

    item.crawl_settings.urls
      .map(url => ({
        ...url,
        headers: this.createKeyValuePairs(url.headers),
        cookies: this.createKeyValuePairs(url.cookies),
        payload: this.createKeyValuePairs(url.payload),
      }))
      .forEach(url => {
        const urlGroup = this.createUrlGroupWithData(url as UrlGroupRawValue)
        settingsGroup.controls.crawl_settings.controls.urls.push(urlGroup)
      })

    return settingsGroup
  }

  updateUrlGroup() {
    this.urlGroupByDays = this.groupByCrawlDays()
  }
  public readonly originalOrder = (): number => 0
}
