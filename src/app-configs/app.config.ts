import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core'
import { provideRouter, withComponentInputBinding, withHashLocation, withViewTransitions } from '@angular/router'
import { routes } from '@/routes/app.routes'
import { provideInterceptors } from 'cast-response'
import { GeneralInterceptor } from '@/model-interceptors/general-interceptor'
import configInit from '../inits/config.init'
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { apiKeyInterceptor } from '@/http-interceptors/api-key.interceptor'
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip'
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar'
import { errorCatchingInterceptor } from '@/http-interceptors/error-catching.interceptor'

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: {
        position: 'above',
      },
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: ['rounded-md', 'bg-primary', 'text-white', 'font-semibold'],
      },
    },
    configInit,
    provideHttpClient(withFetch(), withInterceptors([errorCatchingInterceptor, apiKeyInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation(), withComponentInputBinding(), withViewTransitions()),
    provideAnimationsAsync(),
    provideCharts(withDefaultRegisterables()),
    importProvidersFrom(MatSnackBarModule),
    /* provideClientHydration(), */
    provideInterceptors([GeneralInterceptor]),
  ],
}
