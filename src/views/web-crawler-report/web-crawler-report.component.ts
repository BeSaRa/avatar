import { fadeInSlideUp } from '@/animations/fade-in-slide'
import { URL_PATTERN } from '@/constants/url-pattern'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { LocalService } from '@/services/local.service'
import { WebCrawlerService } from '@/services/web-crawler.service'
import { extractFileName } from '@/utils/utils'
import { NgClass, NgTemplateOutlet } from '@angular/common'
import { Component, ElementRef, inject, signal, viewChildren } from '@angular/core'
import { FormArray, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatTooltipModule } from '@angular/material/tooltip'
import { finalize, takeUntil, tap } from 'rxjs'

@Component({
  selector: 'app-web-crawler-report',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, MatTooltipModule, NgTemplateOutlet],
  templateUrl: './web-crawler-report.component.html',
  styleUrl: './web-crawler-report.component.scss',
  animations: [fadeInSlideUp],
})
export class WebCrawlerReportComponent extends OnDestroyMixin(class {}) {
  lang = inject(LocalService)
  crawlerService = inject(WebCrawlerService)
  fb = inject(NonNullableFormBuilder)
  reportName = signal('')
  reportUrl = signal('')
  loaderUrl = signal<boolean>(false)
  loaderTopic = signal<boolean>(false)
  inputURLS = viewChildren<ElementRef<HTMLInputElement>>('inputURLS')
  inputTopics = viewChildren<ElementRef<HTMLInputElement>>('inputTopics')
  crawlerForm = this.fb.group({
    topics: this.fb.array([this.fb.control('', Validators.required)]),
    urls: this.fb.array([this.fb.control('', [Validators.required, Validators.pattern(URL_PATTERN)])]),
  })
  animateTrigger = signal<boolean>(false)

  get topics(): FormArray {
    return this.crawlerForm.get('topics') as FormArray
  }

  get urls(): FormArray {
    return this.crawlerForm.get('urls') as FormArray
  }

  // Add a new topic
  addTopic() {
    this.topics.push(this.fb.control('', Validators.required))
  }

  // Add a new URL
  addUrl() {
    this.urls.push(this.fb.control('', [Validators.required, Validators.pattern(URL_PATTERN)]))
  }

  // Remove a topic by index
  removeTopic(index: number) {
    this.topics.removeAt(index)
  }

  // Remove a URL by index
  removeUrl(index: number) {
    this.urls.removeAt(index)
  }

  focusLastInput(type: 'topic' | 'urls') {
    const timer = setTimeout(() => {
      const inputs = type === 'topic' ? this.inputTopics() : this.inputURLS()
      const lastIdx = inputs.length - 1
      inputs[lastIdx]?.nativeElement.focus()
      clearTimeout(timer)
    })
  }
  removeOnErase(curr: number, type: 'topic' | 'urls') {
    const inputs = type === 'topic' ? this.inputTopics() : this.inputURLS()
    const remover = type === 'topic' ? this.removeTopic : this.removeUrl
    const value = inputs[curr].nativeElement.value
    if (!value && curr > 0) {
      remover.bind(this)(curr)
      if (curr > 0) {
        inputs[curr - 1].nativeElement.focus()
      }
    }
  }

  crawlWebPages() {
    this.crawlerForm.markAllAsTouched()
    this.crawlerForm.controls.topics.controls.forEach(c => c.markAsDirty())
    this.crawlerForm.controls.urls.controls.forEach(c => c.markAsDirty())
    if (this.crawlerForm.invalid) return
    const data = this.crawlerForm.getRawValue()
    this.loaderTopic.set(true)
    this.crawlerService
      .crawlWebPages(data)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => this.loaderTopic.set(false)))
      .subscribe()
  }

  generateReport(text: string) {
    if (!text) return
    this.loaderUrl.set(true)
    this.crawlerService
      .generateReport(text)
      .pipe(takeUntil(this.destroy$))
      .pipe(tap(() => this.animateTrigger.set(!this.animateTrigger())))
      .pipe(finalize(() => this.loaderUrl.set(false)))
      .subscribe(res => {
        if (res && res.data) {
          this.reportName.set(extractFileName(res.data!.report_url))
          this.reportUrl.set(res.data!.report_url)
        }
      })
  }
}
