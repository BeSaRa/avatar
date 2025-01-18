import { DOCUMENT, NgIf } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormGroup, FormArray, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatTabsModule } from '@angular/material/tabs'
import { JsonHighlightPipe } from '../../pipes/json-highlight.pipe'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { transformKeyValueArrayToObject } from '@/utils/utils'
import { MediaCrawler } from '@/models/media-crawler'
import { startWith, tap } from 'rxjs'
import { LocalService } from '@/services/local.service'
import { AdminService } from '@/services/admin.service'
import { KeyvaluePairFormComponent } from '../../components/keyvalue-pair-form/keyvalue-pair-form.component'
import { SettingsFormComponent } from '../../components/settings-form/settings-form.component'
import { MatDialog } from '@angular/material/dialog'
import { AddUrlPopupComponent } from '@/components/add-url-popup/add-url-popup.component'

@Component({
  selector: 'app-admin-crawler',
  standalone: true,
  imports: [
    MatTabsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    JsonHighlightPipe,
    KeyvaluePairFormComponent,
    SettingsFormComponent,
    NgIf,
  ],
  templateUrl: './admin-crawler.component.html',
  styleUrls: ['./admin-crawler.component.scss'],
})
export class AdminCrawlerComponent extends OnDestroyMixin(class {}) implements OnInit {
  crawlerForm!: FormGroup
  fb = inject(NonNullableFormBuilder)
  formatedValue!: MediaCrawler
  doc = inject(DOCUMENT)
  lang = inject(LocalService)
  adminService = inject(AdminService)
  dialog = inject(MatDialog)

  showJsonPreview = false

  toggleJsonPreview() {
    this.showJsonPreview = !this.showJsonPreview
  }

  constructor() {
    super()
    this.createCrawlerForm()
  }
  ngOnInit(): void {
    this.listenToCrawlerFormChange()
  }
  createCrawlerForm() {
    this.crawlerForm = this.fb.group({
      urls: this.fb.array([]),
      settings: this.adminService.createSettingsGroup(),
    })
  }

  transformData(input: ReturnType<(typeof this.crawlerForm)['getRawValue']>) {
    return {
      ...input,
      urls: input.urls.map(
        (url: {
          headers: { key: string; value: string }[]
          cookies: { key: string; value: string }[]
          payload: { key: string; value: string }[]
        }) => ({
          ...url,
          headers: transformKeyValueArrayToObject(url.headers),
          cookies: transformKeyValueArrayToObject(url.cookies),
          payload: transformKeyValueArrayToObject(url.payload),
        })
      ),
    }
  }
  listenToCrawlerFormChange() {
    this.crawlerForm.valueChanges.pipe(startWith(this.crawlerForm.value)).subscribe(val => {
      this.formatedValue = this.transformData(val)
    })
  }

  // Form Array Accessors
  get urlsArray(): FormArray {
    return this.crawlerForm.get('urls') as FormArray
  }

  // Utility methods for adding controls dynamically
  addUrl(): void {
    this.dialog
      .open(AddUrlPopupComponent, {
        width: '70vw',
      })
      .afterClosed()
      .pipe(
        tap(res => {
          if (res) {
            this.urlsArray.push(res)
          }
        })
      )
  }

  removeUrl(index: number) {
    this.urlsArray.removeAt(index)
  }

  submitTheForm() {
    this.adminService.crawlWeb(this.formatedValue).subscribe()
  }

  copyToClipboard(): void {
    const txt = JSON.stringify(this.formatedValue, null, 2)
    this.doc.defaultView?.navigator.clipboard.writeText(txt).then(
      () => {
        console.log('JSON copied to clipboard successfully!')
      },
      err => {
        console.error('Failed to copy JSON:', err)
      }
    )
  }
}
