// statistics.component.ts
import { Component, inject, viewChild } from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { ChartConfiguration } from 'chart.js'
import { BaseChartDirective } from 'ng2-charts'
import { map, startWith, switchMap, debounceTime } from 'rxjs'
import { AdminService } from '@/services/admin.service'
import { LocalService } from '@/services/local.service'
import { WebCrawlerService } from '@/services/web-crawler.service'
import { MostIndexedUrlsContract, MostUsedKeywordsContract } from '@/contracts/statistics-contract'
import { dateRangeValidator } from '@/utils/utils'

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [AsyncPipe, BaseChartDirective, ReactiveFormsModule],
  templateUrl: './statistics.component.html',
})
export class StatisticsComponent {
  lang = inject(LocalService)
  adminService = inject(AdminService)
  crawlingService = inject(WebCrawlerService)
  fb = inject(NonNullableFormBuilder)

  reportCount$ = this.adminService.getReportsCount()
  urlCount$ = this.adminService.getUrlsCount()

  mostIndexedChart = viewChild('indexedChart', { read: BaseChartDirective })
  mostUsedKeywordsChart = viewChild('keywordsChart', { read: BaseChartDirective })

  indexedForm = this.fb.group(
    { from_date: [''], to_date: [''] },
    { validators: dateRangeValidator([['from_date', 'to_date']], ['DateInvalidRangeIndexed']) }
  )
  keywordsForm = this.fb.group(
    { from_date: [''], to_date: [''] },
    { validators: dateRangeValidator([['from_date', 'to_date']], ['DateInvalidRangeKeyword']) }
  )

  mostIndexedUrl$ = this.indexedForm.valueChanges.pipe(
    startWith(this.indexedForm.value),
    debounceTime(300),
    switchMap(({ from_date, to_date }) => this.crawlingService.getMostIndexedStatistics(from_date, to_date)),
    map(data => ({
      title: this.lang.locals.most_indexed_urls,
      chart: this.getChartConfig(data),
    }))
  )

  mostUsedKeywords$ = this.keywordsForm.valueChanges.pipe(
    startWith(this.keywordsForm.value),
    debounceTime(300),
    switchMap(({ from_date, to_date }) => this.crawlingService.getMostUsedKeywordStatistics(from_date, to_date)),
    map(data => ({
      title: this.lang.locals.most_used_keywords,
      chart: this.getKeywordChartConfig(data),
    }))
  )

  getChartConfig(data: MostIndexedUrlsContract[]): ChartConfiguration {
    const urlCountMap = new Map<string, { count: number; dates: Set<string> }>()
    data.forEach(item => {
      const url = decodeURIComponent(item.Most_indexed_URL)
      const date = item.IndexDate
      const entry = urlCountMap.get(url) || { count: 0, dates: new Set<string>() }
      entry.count += item.Count
      entry.dates.add(date)
      urlCountMap.set(url, entry)
    })

    const sorted = Array.from(urlCountMap.entries()).sort((a, b) => a[1].count - b[1].count)
    const labels = sorted.map(([url, val]) => `${url} (${Array.from(val.dates).join(', ')})`)
    const values = sorted.map(e => e[1].count)

    return {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: this.lang.locals.links_count,
            data: values,
            backgroundColor: 'rgba(138, 21, 56, 0.5)',
            borderColor: 'rgba(138, 21, 56)',
            borderWidth: 2,
          },
        ],
      },
      options: this.getChartOptions(),
    }
  }

  getKeywordChartConfig(data: MostUsedKeywordsContract[]): ChartConfiguration {
    const keywordMap = new Map<string, { count: number; dates: Set<string> }>()
    data.forEach(item => {
      const keyword = item['Most-used-keywords'].trim()
      const date = item.IndexDate
      const entry = keywordMap.get(keyword) || { count: 0, dates: new Set<string>() }
      entry.count += item.Count
      entry.dates.add(date)
      keywordMap.set(keyword, entry)
    })

    const sorted = Array.from(keywordMap.entries()).sort((a, b) => a[1].count - b[1].count)
    const labels = sorted.map(([kw, val]) => `${kw} (${Array.from(val.dates).join(', ')})`)
    const values = sorted.map(e => e[1].count)

    return {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: this.lang.locals.keywords_count,
            data: values,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235)',
            borderWidth: 2,
          },
        ],
      },
      options: this.getChartOptions(),
    }
  }

  getChartOptions(): ChartConfiguration['options'] {
    return {
      responsive: true,
      indexAxis: 'y',
      plugins: {
        legend: { display: true },
        zoom: {
          zoom: {
            wheel: { enabled: true },
            drag: { enabled: true },
            pinch: { enabled: true },
            mode: 'xy',
          },
          pan: {
            enabled: true,
            mode: 'xy',
          },
          limits: {
            x: { min: 0 },
            y: { min: 0 },
          },
        },
      },
      scales: {
        x: { beginAtZero: true },
        y: { ticks: { font: { size: 12 } } },
      },
    }
  }

  resetIndexedZoom() {
    this.mostIndexedChart()?.chart?.resetZoom()
  }

  resetKeywordsZoom() {
    this.mostUsedKeywordsChart()?.chart?.resetZoom()
  }
}
