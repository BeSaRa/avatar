import { bootstrapApplication } from '@angular/platform-browser'
import { AppComponent } from '@/views/app/app.component'
import { appConfig } from '@/configs/app.config'

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err))
