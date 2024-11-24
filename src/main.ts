import { bootstrapApplication } from '@angular/platform-browser'
import { AppComponent } from '@/views/app/app.component'
import { appConfig } from '@/configs/app.config'
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(...registerables, ChartDataLabels)
Chart.defaults.plugins!.datalabels!.display = false
Chart.defaults.font.family = 'Roboto, Lusail'
bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err))
