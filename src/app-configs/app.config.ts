import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import { routes } from '@/routes/app.routes'
import { provideInterceptors } from 'cast-response'
import { GeneralInterceptor } from '@/model-interceptors/general-interceptor'
import configInit from '../inits/config.init'
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'

export const appConfig: ApplicationConfig = {
  providers: [
    configInit,
    provideHttpClient(withFetch(), withInterceptors([])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    /* provideClientHydration(), */
    provideInterceptors([GeneralInterceptor]),
  ],
}
