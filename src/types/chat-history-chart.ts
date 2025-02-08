import { ChartConfiguration } from 'chart.js'

export type ChartType = 'feedback' | 'sentiment' | 'performance'

export interface ChartDetails {
  title: string
  chart: ChartConfiguration
}

export type ChartRecord = Record<`${ChartType}_chart`, ChartDetails>
