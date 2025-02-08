import { AdminService } from '@/services/admin.service'
import { LocalService } from '@/services/local.service'
import { AsyncPipe } from '@angular/common'
import { Component, inject } from '@angular/core'
import { ChartConfiguration } from 'chart.js'
import { BaseChartDirective } from 'ng2-charts'
import { map } from 'rxjs'

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [AsyncPipe, BaseChartDirective],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent {
  lang = inject(LocalService)
  adminService = inject(AdminService)
  reportCount$ = this.adminService.getReportsCount()
  urlCount$ = this.adminService.getUrlsCount()
  crawlingStatistics$ = this.adminService
    .getCrawlingStatistics()
    .pipe(map(res => ({ title: this.lang.locals.web_crawling_stats, chart: this.getChartConfig(res) })))

  // Function to generate chart configuration
  getChartConfig(data: Record<string, string[]>): ChartConfiguration {
    return {
      type: 'bar',
      data: this.calculateArticleDistribution(data),
      options: this.getChartOptions(),
    }
  }

  // Function to calculate and return chart data
  calculateArticleDistribution(data: Record<string, string[]>) {
    const labels: string[] = []
    const values: number[] = []

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        labels.push(key)
        values.push(data[key].length)
      }
    }

    return {
      labels: labels,
      datasets: [
        {
          label: this.lang.locals.reports_number,
          data: values,
          backgroundColor: 'rgba(138, 21, 56, 0.5)', // Body color with 50% opacity
          borderColor: 'rgba(138, 21, 56)',
          borderWidth: 2,
        },
      ],
    }
  }

  getChartOptions(): ChartConfiguration['options'] {
    return {
      responsive: true,
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          ticks: {
            font: {
              size: 12,
            },
          },
        },
      },
    }
  }
}
