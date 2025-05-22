// statistics.component.ts
import { Component, inject, OnInit, viewChild } from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { ChartConfiguration, TooltipItem } from 'chart.js'
import { BaseChartDirective } from 'ng2-charts'
import { map, Observable } from 'rxjs'
import { AdminService } from '@/services/admin.service'
import { LocalService } from '@/services/local.service'
import { WebCrawlerService } from '@/services/web-crawler.service'
import {
  MostIndexedUrlsContract,
  MostUsedKeywordsContract,
  NewsPercentageContract,
} from '@/contracts/statistics-contract'
import { dateRangeValidator, markAllControlsAsTouchedAndDirty } from '@/utils/utils'
import { Context } from 'chartjs-plugin-datalabels'
import { HasPermissionDirective } from '@/directives/has-permission.directive'
import { ButtonDirective } from '@/directives/button.directive'
import { StatisticsData } from '@/contracts/statisctics-data-contract'

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [AsyncPipe, BaseChartDirective, ReactiveFormsModule, HasPermissionDirective, ButtonDirective],
  templateUrl: './statistics.component.html',
})
export class StatisticsComponent implements OnInit {
  lang = inject(LocalService)
  adminService = inject(AdminService)
  crawlingService = inject(WebCrawlerService)
  fb = inject(NonNullableFormBuilder)

  mostIndexedChart = viewChild('indexedChart', { read: BaseChartDirective })
  mostUsedKeywordsChart = viewChild('keywordsChart', { read: BaseChartDirective })

  rangeForm = this.fb.group(
    { from_date: [''], to_date: [''] },
    { validators: dateRangeValidator([['from_date', 'to_date']], ['DateInvalidRangeIndexed']) }
  )

  statistics$!: Observable<StatisticsData>

  ngOnInit(): void {
    this.loadStatistics()
  }

  loadStatistics() {
    const { from_date, to_date } = this.rangeForm.value
    if (this.rangeForm.invalid) {
      markAllControlsAsTouchedAndDirty(this.rangeForm)
      return
    }

    this.statistics$ = this.crawlingService.getStatistics(from_date!, to_date!).pipe(
      map(({ mostIndexed, mostKeywords, newsPercentage, totalIndexed }) => ({
        mostIndexedChart: {
          title: this.lang.locals.most_indexed_urls,
          chart: this.getChartConfig(mostIndexed),
        },
        mostUsedKeywordsChart: {
          title: this.lang.locals.most_used_keywords,
          chart: this.getKeywordChartConfig(mostKeywords),
        },
        newsPercentageChart: {
          title: this.lang.locals.indexed_sources_percentage,
          chart: this.getNewsPercentageChartConfig(newsPercentage),
        },
        totalIndexedNewsCount: totalIndexed,
      }))
    )
  }

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

  getNewsPercentageChartConfig(data: NewsPercentageContract): ChartConfiguration {
    const values = Object.values(data) as number[]
    const labels = Object.keys(data)

    // If all values are zero, inject a dummy slice (Chart.js requires > 0 to render)
    const total = values.reduce((a, b) => a + b, 0)
    const finalValues = total === 0 ? [1] : values
    const finalLabels = total === 0 ? [this.lang.locals.no_data_to_preview] : labels

    return {
      type: 'pie',
      data: {
        labels: finalLabels,
        datasets: [
          {
            label: this.lang.locals.indexed_sources_percentage,
            data: finalValues,
          },
        ],
      },
      options: this.getNewsPercentageChartOptions(),
    }
  }

  getNewsPercentageChartOptions(): ChartConfiguration['options'] {
    return {
      ...this.getChartOptions(),
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          ...this.getChartOptions()!.plugins!.tooltip,
          callbacks: {
            title: () => {
              return this.lang.locals.keywords
            },
            label: (context: TooltipItem<'pie'>) => {
              const label = context.label || ''
              return [`${label}:${this.lang.locals.no_data_to_preview ? 0 : context.raw}%`]
            },
          },
        },
        datalabels: {
          textAlign: 'center',
          color: '#ffffff', // White text for better contrast
          font: {
            size: 14,
          },
          backgroundColor: (context: Context) => (context.dataset.backgroundColor as string[])[context.dataIndex],
          borderColor: '#ffffff',
          borderRadius: 8,
          borderWidth: 1,
          padding: {
            left: 10,
            right: 10,
          },
          display: (context: Context) => {
            const dataset = context.dataset.data as number[]
            const value = dataset[context.dataIndex]
            return value > 0 || dataset.length === 1
          },
          formatter: (value: number, context: Context) => {
            const label = (context.chart.data.labels as string[])[context.dataIndex]
            return [label, `${label === this.lang.locals.no_data_to_preview ? 0 : value}%`]
          },
        },
      },
      scales: undefined,
    }
  }

  getChartOptions(): ChartConfiguration['options'] {
    return {
      responsive: true,
      indexAxis: 'y',
      plugins: {
        legend: { display: true },
        tooltip: {
          rtl: this.lang.currentLanguage === 'ar',
        },
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
            x: { min: 0, max: 100 },
            y: { min: 0, max: 100 },
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
