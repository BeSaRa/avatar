import { CommonModule, DOCUMENT, NgClass } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { FormArray, ReactiveFormsModule } from '@angular/forms'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatTabsModule } from '@angular/material/tabs'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { MediaCrawler } from '@/models/media-crawler'
import { finalize, takeUntil, tap } from 'rxjs'
import { LocalService } from '@/services/local.service'
import { AdminService } from '@/services/admin.service'
import { SettingsFormComponent } from '../../components/settings-form/settings-form.component'
import { MatDialog } from '@angular/material/dialog'
import { AddUrlPopupComponent } from '@/components/add-url-popup/add-url-popup.component'
import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { UrlSummaryCardComponent } from '../../components/url-summary-card/url-summary-card.component'
import { createCrawlerGroup, UrlGroup } from '@/types/url-crawler'
import { JsonPreviewerPopupComponent } from '@/components/json-previewer-popup/json-previewer-popup.component'
import { transformData } from '@/utils/utils'
import { searchAnimation } from '@/animations/search-animation'

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
export class AdminCrawlerComponent extends OnDestroyMixin(class {}) {
  crawlerForm = createCrawlerGroup()
  doc = inject(DOCUMENT)
  lang = inject(LocalService)
  adminService = inject(AdminService)
  dialog = inject(MatDialog)
  selectedTab = signal<'urls' | 'settings'>('urls')
  urlsSignal = signal(this.urlsArray.controls)
  isloading = signal(false)

  constructor() {
    super()
  }

  // Form Array Accessors
  get urlsArray(): FormArray<UrlGroup> {
    return this.crawlerForm.get('urls') as FormArray<UrlGroup>
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
            this.urlsArray.push(res)
          }
        })
      )
      .subscribe()
  }

  removeUrl(index: number) {
    this.urlsArray.removeAt(index)
  }

  previewJson() {
    this.dialog.open<JsonPreviewerPopupComponent<MediaCrawler>, MediaCrawler, boolean>(JsonPreviewerPopupComponent, {
      data: transformData(this.crawlerForm.getRawValue()),
    })
  }
  startCrawling() {
    this.isloading.set(true)
    const formattedValue = transformData(this.crawlerForm.getRawValue())
    this.adminService
      .crawlWeb(formattedValue)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isloading.set(false))
      )
      .subscribe()
  }
}
