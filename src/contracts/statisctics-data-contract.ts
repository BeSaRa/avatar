import { ChartConfiguration } from 'chart.js'

export interface StatisticsData {
  mostIndexedChart: { title: string; chart: ChartConfiguration }
  mostUsedKeywordsChart: { title: string; chart: ChartConfiguration }
  newsPercentageChart: { title: string; chart: ChartConfiguration }
  totalIndexedNewsCount: number
}
