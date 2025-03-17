import { fadeInSlideUp } from '@/animations/fade-in-slide'
import { URL_PATTERN } from '@/constants/url-pattern'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { LocalService } from '@/services/local.service'
import { WebCrawlerService } from '@/services/web-crawler.service'
import {
  convertMarkdownToHtmlHeaders,
  extractFileName,
  formatString,
  formatText,
  markAllControlsAsTouchedAndDirty,
} from '@/utils/utils'
import { NgClass, NgTemplateOutlet } from '@angular/common'
import { Component, ElementRef, inject, signal, viewChildren } from '@angular/core'
import {
  AbstractControl,
  FormArray,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms'
import { MatTooltipModule } from '@angular/material/tooltip'
import { catchError, finalize, takeUntil, tap } from 'rxjs'
import html2pdf from 'html2pdf.js'
import { CrawlerUrl, MediaCrawler } from '@/models/media-crawler'
import { GenerteReportContract } from '@/contracts/generate-report-contract'
import { ChipsInputComponent } from '@/components/chips-input/chips-input.component'

@Component({
  selector: 'app-web-crawler-report',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, MatTooltipModule, NgTemplateOutlet, ChipsInputComponent],
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
  reportTxt = signal('')
  loaderUrl = signal<boolean>(false)
  loaderTopic = signal<boolean>(false)
  inputURLS = viewChildren<ElementRef<HTMLInputElement>>('inputURLS')
  inputTopics = viewChildren<ElementRef<HTMLInputElement>>('inputTopics')
  crawlerForm = this.fb.group({
    topics: this.fb.array([this.fb.control('', Validators.required)]),
    urls: this.fb.array([this.fb.control('', [Validators.required, Validators.pattern(URL_PATTERN)])]),
  })
  reportForm = this.fb.group(
    {
      search_text: this.fb.control(null, Validators.required),
      index_date_from: this.fb.control(null),
      index_date_to: this.fb.control(null),
      news_date_from: this.fb.control(null),
      news_date_to: this.fb.control(null),
      tags: this.fb.control([]),
    },
    { validators: [this.dateRangeValidator, this.futureIndexDateValidator] }
  )
  animateTrigger = signal<boolean>(false)

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const indexFrom = group.get('index_date_from')?.value
    const indexTo = group.get('index_date_to')?.value
    const newsFrom = group.get('news_date_from')?.value
    const newsTo = group.get('news_date_to')?.value

    const errors: ValidationErrors = {}

    if (indexFrom && indexTo && indexFrom > indexTo) {
      errors['indexDateRangeInvalid'] = true
    }

    if (newsFrom && newsTo && newsFrom > newsTo) {
      errors['newsDateRangeInvalid'] = true
    }

    return Object.keys(errors).length > 0 ? errors : null
  }

  futureIndexDateValidator(group: AbstractControl): ValidationErrors | null {
    const today = new Date().toISOString().split('T')[0]
    const fields = ['index_date_to']

    for (const field of fields) {
      const control = group.get(field)
      if (control?.value && control.value > today) {
        return { futureDateInvalid: true }
      }
    }

    return null
  }

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
    const contract = new MediaCrawler()
    contract.settings.topics = data.topics
    contract.urls = data.urls.map((url: string) => new CrawlerUrl(url, data.topics, true))
    contract.urls.forEach(url => {
      delete url.cookies
      delete url.headers
      delete url.payload
    })
    console.log(contract)
    this.loaderTopic.set(true)
    this.crawlerService
      .crawlWebPages(contract)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => this.loaderTopic.set(false)))
      .subscribe()
  }

  generateReport(): void {
    if (this.reportForm.invalid) {
      markAllControlsAsTouchedAndDirty(this.reportForm)
      return
    }
    this.loaderUrl.set(true)
    const reportFilter: Partial<GenerteReportContract> = Object.fromEntries(
      Object.entries(this.reportForm.value).filter(([, value]) =>
        Array.isArray(value) ? value && value.length > 0 : Boolean(value)
      )
    )
    this.crawlerService
      .generateReport(reportFilter)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.animateTrigger.set(!this.animateTrigger())),
        finalize(() => this.loaderUrl.set(false)),
        catchError(error => {
          console.error('Error generating report:', error)
          return []
        })
      )
      .subscribe(res => {
        if (!res || !res.data) return

        const {
          data: { final_response, references, report_url },
        } = res

        if (final_response?.message?.content && references) {
          this.reportName.set(extractFileName(report_url).split('.')[0])
          this.reportUrl.set(report_url)

          const formattedContent = formatString(
            formatText(convertMarkdownToHtmlHeaders(final_response.message.content), final_response.message)
          )

          this.reportTxt.set(formattedContent)
        }
      })
  }

  downloadPdf() {
    const el = document.getElementById('pdf-content')
    // Configuration options
    const options = {
      margin: 5,
      filename: `${this.reportName()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      pagebreak: {
        mode: ['avoid-all'],
      },
      jsPDF: { orientation: 'portrait' },
    }
    // Generate the PDF
    html2pdf().from(el).set(options).save()
  }
}
