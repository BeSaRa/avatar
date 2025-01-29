import { APP_INITIALIZER, Injector, Provider } from '@angular/core'
import { ConfigService } from '@/services/config.service'
import { UrlService } from '@/services/url.service'
import { catchError, forkJoin, of, switchMap, tap } from 'rxjs'
import { SpeechService } from '@/services/speech.service'
import { LocalService } from '@/services/local.service'
import { AppStore } from '@/stores/app.store'

export default {
  provide: APP_INITIALIZER,
  useFactory: (
    configService: ConfigService,
    urlService: UrlService,
    injector: Injector,
    commonService: SpeechService,
    local: LocalService
  ) => {
    return () =>
      forkJoin([configService.load()]).pipe(
        tap(() => urlService.setConfigService(configService)),
        tap(() => urlService.prepareUrls()),
        switchMap(() =>
          commonService.generateSpeechToken().pipe(
            tap(response => injector.get(AppStore).updateSpeechToken(response)),
            catchError(error => {
              console.error('Error generating speech token:', error)
              // Optionally log the error or set a fallback state
              return of(null) // Return a fallback observable
            })
          )
        ),
        switchMap(() => local.load())
      )
  },
  deps: [ConfigService, UrlService, Injector, SpeechService, LocalService],
  multi: true,
} satisfies Provider
