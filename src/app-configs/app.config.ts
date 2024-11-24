import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router'
import { routes } from '@/routes/app.routes'
import { provideInterceptors } from 'cast-response'
import { GeneralInterceptor } from '@/model-interceptors/general-interceptor'
import configInit from '../inits/config.init'
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { apiKeyInterceptor } from '@/http-interceptors/api-key.interceptor'
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip'
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: {
        position: 'above',
      },
    },
    configInit,
    provideHttpClient(withFetch(), withInterceptors([apiKeyInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation(), withComponentInputBinding()),
    provideAnimationsAsync(),
    provideCharts(withDefaultRegisterables()),
    /* provideClientHydration(), */
    provideInterceptors([GeneralInterceptor]),
  ],
}
