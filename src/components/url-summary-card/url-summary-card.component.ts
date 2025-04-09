import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { AdminService } from '@/services/admin.service'
import { DatePipe, NgClass, NgTemplateOutlet } from '@angular/common'
import { AfterViewInit, Component, ElementRef, inject, input, output, signal, viewChildren } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { AddUrlPopupComponent } from '../add-url-popup/add-url-popup.component'
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component'
import { ConfirmationDialogDataContact } from '@/contracts/confirmation-dialog-data-contract'
import { LocalService } from '@/services/local.service'
import { JsonPreviewerPopupComponent } from '../json-previewer-popup/json-previewer-popup.component'
import { CrawlerSettingGroup, UrlGroup } from '@/types/url-crawler'
import { CrawlerUrl } from '@/models/media-crawler'
import { transformData } from '@/utils/utils'
import { takeUntil, tap } from 'rxjs'
import { MatTooltip } from '@angular/material/tooltip'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'

@Component({
  selector: 'app-url-summary-card',
  standalone: true,
  imports: [PerfectScrollDirective, NgTemplateOutlet, MatTooltip, NgClass, DatePipe],
  templateUrl: './url-summary-card.component.html',
  styleUrl: './url-summary-card.component.scss',
})
export class UrlSummaryCardComponent extends OnDestroyMixin(class {}) implements AfterViewInit {
  adminService = inject(AdminService)
  dialog = inject(MatDialog)
  lang = inject(LocalService)
  crawlerSettingGroupForm = input.required<CrawlerSettingGroup>()
  onUrlDelete = output<void>()
  onUrlEdit = output<void>()
  activeTab = signal<'headers' | 'payload' | 'cookies'>('headers')
  indicatorWidth = signal('0px')
  indicatorTransform = signal('translateX(0)')
  tabs = viewChildren<ElementRef<HTMLSpanElement>>('tab')

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateIndicator()
    })
  }

  setActiveTab(tab: 'headers' | 'payload' | 'cookies') {
    this.activeTab.set(tab)
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
    const tabs = ['headers', 'cookies', 'payload']
    return tabs.indexOf(this.activeTab())
  }

  editUrl() {
    this.dialog
      .open<AddUrlPopupComponent, UrlGroup, UrlGroup>(AddUrlPopupComponent, {
        //! the urls list always has one item
        data: this.crawlerSettingGroupForm().controls.crawl_settings.controls.urls.at(0),
        width: '70vw',
      })
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        tap(res => {
          if (res) {
            this.crawlerSettingGroupForm().patchValue({
              crawl_days: res?.getRawValue().settings.schedule_by_days,
            })
            this.onUrlEdit.emit()
          }
        })
      )
      .subscribe()
  }

  deleteUrl() {
    this.dialog
      .open<ConfirmationPopupComponent, ConfirmationDialogDataContact, boolean>(ConfirmationPopupComponent, {
        data: {
          // eslint-disable-next-line max-len
          htmlContent: `<p class="flex flex-col gap-4 text-center text-xl text-gray-700">${this.lang.locals.delete_message} <span class="italic text-sm text-primary">${this.crawlerSettingGroupForm().controls.crawl_settings.controls.urls.at(0).getRawValue().link}<span> ? </p>`,
        },
      })
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        tap(res => {
          if (res) {
            this.onUrlDelete.emit()
          }
        })
      )
      .subscribe()
  }
  previewUrlAsJSON() {
    this.dialog.open<JsonPreviewerPopupComponent<CrawlerUrl>, CrawlerUrl, boolean>(JsonPreviewerPopupComponent, {
      data: transformData(this.crawlerSettingGroupForm().controls.crawl_settings.controls.urls.at(0).getRawValue()),
    })
  }
}
