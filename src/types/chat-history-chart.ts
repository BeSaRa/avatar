import { ChartConfiguration } from 'chart.js'

export type ChartType = 'feedback' | 'sentiment' | 'performance'

export type ChartRecord = Record<`${ChartType}_chart`, { title: string; chart: ChartConfiguration }>
