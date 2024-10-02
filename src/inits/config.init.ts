import { APP_INITIALIZER, Injector, Provider } from '@angular/core'
import { ConfigService } from '@/services/config.service'
import { UrlService } from '@/services/url.service'
import { forkJoin, switchMap, tap } from 'rxjs'
import { CommonService } from '@/services/common.service'
import { AppStore } from '@/stores/app.store'

export default {
  provide: APP_INITIALIZER,
  useFactory: (
    configService: ConfigService,
    urlService: UrlService,
    injector: Injector,
    commonService: CommonService
  ) => {
    return () =>
      forkJoin([configService.load()]).pipe(
        tap(() => urlService.setConfigService(configService)),
        tap(() => urlService.prepareUrls()),
        switchMap(() => commonService.generateSpeechToken()),
        tap(response => injector.get(AppStore).updateSpeechToken(response))
      )
  },
  deps: [ConfigService, UrlService, Injector, CommonService],
  multi: true,
} satisfies Provider
