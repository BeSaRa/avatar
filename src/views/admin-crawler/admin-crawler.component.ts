import { DOCUMENT } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import {
  FormGroup,
  FormArray,
  FormControl,
  ReactiveFormsModule,
  NonNullableFormBuilder,
  AbstractControl,
} from '@angular/forms'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatTabsModule } from '@angular/material/tabs'
import { JsonHighlightPipe } from '../../pipes/json-highlight.pipe'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { transformKeyValueArrayToObject } from '@/utils/utils'
import { MediaCrawler } from '@/models/media-crawler'
import { startWith } from 'rxjs'
import { LocalService } from '@/services/local.service'
import { AdminService } from '@/services/admin.service'

@Component({
  selector: 'app-admin-crawler',
  standalone: true,
  imports: [MatTabsModule, ReactiveFormsModule, MatExpansionModule, JsonHighlightPipe],
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

  constructor() {
    super()
    this.createCrawlerForm()
  }
  ngOnInit(): void {
    this.listenToCrawlerFormChange()
  }
  createCrawlerForm() {
    this.crawlerForm = this.fb.group({
      urls: this.fb.array([this.createUrlGroup()]),
      settings: this.createSettingsGroup(),
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

  // Helper methods to create form groups
  createUrlGroup(): FormGroup {
    return this.fb.group({
      link: this.fb.control(''),
      headers: this.fb.array([]),
      cookies: this.fb.array([]),
      payload: this.fb.array([]),
      settings: this.createSettingsGroup(),
    })
  }

  createSettingsGroup(): FormGroup {
    return this.fb.group({
      deep: this.fb.control(false),
      selectors: this.fb.array([]),
      mediaCrawling: this.fb.control(false),
      topics: this.fb.array([]),
      containerName: this.fb.control('rera-storage'),
    })
  }

  // Form Array Accessors
  get urlsArray(): FormArray {
    return this.crawlerForm.get('urls') as FormArray
  }

  headersArray(index: number): FormArray {
    return this.urlsArray.at(index).get('headers') as FormArray
  }

  cookiesArray(index: number): FormArray {
    return this.urlsArray.at(index).get('cookies') as FormArray
  }

  payloadArray(index: number): FormArray {
    return this.urlsArray.at(index).get('payload') as FormArray
  }

  selectorsArray(index: number): FormArray {
    return this.urlsArray.at(index).get('settings')!.get('selectors') as FormArray
  }

  topicsArray(index: number): FormArray {
    return this.urlsArray.at(index).get('settings')!.get('topics') as FormArray
  }

  mainSelectorsArray() {
    return this.crawlerForm.get('settings')!.get('selectors') as FormArray
  }

  mainTopicsArray() {
    return this.crawlerForm.get('settings')!.get('topics') as FormArray
  }

  urlSettings(index: number): FormGroup {
    return this.urlsArray.at(index).get('settings') as FormGroup
  }

  mainSettings(): FormGroup {
    return this.crawlerForm.get('settings') as FormGroup
  }

  // Utility methods to retrieve FormControl
  linkControl(index: number): FormControl {
    return this.urlsArray.at(index).get('link') as FormControl
  }

  settingControl(controlName: string): FormControl {
    return this.mainSettings().get(controlName) as FormControl
  }

  keyValueControl(array: FormArray, index: number, controlName: string): FormControl {
    return array.at(index).get(controlName) as FormControl
  }

  // Utility methods for adding controls dynamically
  addUrl(): void {
    this.urlsArray.push(this.createUrlGroup())
  }

  removeUrl(index: number) {
    this.urlsArray.removeAt(index)
  }

  checkFormArray(contorl: AbstractControl): asserts contorl is FormArray {
    if (!(contorl instanceof FormArray)) {
      throw Error('Please Pass Array')
    }
  }

  // headers, cookies ,payload in url
  addKeyValuePair(index: number, arrayName: 'headers' | 'cookies' | 'payload'): void {
    const contorl = this.urlsArray.at(index).get(arrayName)
    this.checkFormArray(contorl!)
    contorl.push(this.fb.group({ key: this.fb.control(''), value: this.fb.control('') }))
  }

  removeKeyValuePair(urlIndex: number, index: number, arrayName: 'headers' | 'cookies' | 'payload') {
    const contorl = this.urlsArray.at(urlIndex).get(arrayName)
    this.checkFormArray(contorl!)
    contorl.removeAt(index)
  }

  //url settings
  addSelector(index: number) {
    this.selectorsArray(index).push(this.fb.control(''))
  }
  removeSelector(urlIndex: number, index: number) {
    this.selectorsArray(urlIndex).removeAt(index)
  }
  addTopic(index: number) {
    this.topicsArray(index).push(this.fb.control(''))
  }
  removeTopic(urlIndex: number, index: number) {
    this.topicsArray(urlIndex).removeAt(index)
  }

  // main Settings
  addMainSelector(): void {
    this.mainSelectorsArray().push(this.fb.control(''))
  }
  removeMainSelector(index: number) {
    this.mainSelectorsArray().removeAt(index)
  }
  addMainTopic(): void {
    this.mainTopicsArray().push(this.fb.control(''))
  }
  removeMainTopic(index: number) {
    this.mainTopicsArray().removeAt(index)
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
