import { APP_INITIALIZER, Injector, Provider } from '@angular/core'
import { ConfigService } from '@/services/config.service'
import { UrlService } from '@/services/url.service'
import { forkJoin, switchMap, tap } from 'rxjs'
import { SpeechService } from '@/services/speech.service'
import { LocalService } from '@/services/local.service'
import { ApplicationUserService } from '@/views/auth/services/application-user.service'

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
        switchMap(() => local.load()),
        tap(() => injector.get(ApplicationUserService).checkAutoLogoutOnRefresh())
      )
  },
  deps: [ConfigService, UrlService, Injector, SpeechService, LocalService],
  multi: true,
} satisfies Provider
