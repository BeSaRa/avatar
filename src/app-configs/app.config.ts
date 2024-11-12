import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter, withHashLocation } from '@angular/router'
import { routes } from '@/routes/app.routes'
import { provideInterceptors } from 'cast-response'
import { GeneralInterceptor } from '@/model-interceptors/general-interceptor'
import configInit from '../inits/config.init'
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { apiKeyInterceptor } from '@/http-interceptors/api-key.interceptor'

export const appConfig: ApplicationConfig = {
  providers: [
    configInit,
    provideHttpClient(withFetch(), withInterceptors([apiKeyInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideAnimationsAsync(),
    /* provideClientHydration(), */
    provideInterceptors([GeneralInterceptor]),
  ],
}
