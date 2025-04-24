import { apiKeyInterceptor } from '@/http-interceptors/api-key.interceptor'
import { errorCatchingInterceptor } from '@/http-interceptors/error-catching.interceptor'
import { TokenInterceptor } from '@/http-interceptors/token.interceptor'
import { GeneralInterceptor } from '@/model-interceptors/general-interceptor'
import { routes } from '@/routes/app.routes'
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core'
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar'
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router'
import { provideInterceptors } from 'cast-response'
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'
import configInit from '../inits/config.init'
import { successHandlerInterceptor } from '@/http-interceptors/success-handler.interceptor'

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
        panelClass: ['rounded-lg', 'text-white'],
      },
    },

    configInit,
    provideHttpClient(
      withFetch(),
      withInterceptors([errorCatchingInterceptor, apiKeyInterceptor, TokenInterceptor, successHandlerInterceptor])
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideAnimationsAsync(),
    provideCharts(withDefaultRegisterables()),
    importProvidersFrom(MatSnackBarModule),
    /* provideClientHydration(), */
    provideInterceptors([GeneralInterceptor]),
  ],
}
