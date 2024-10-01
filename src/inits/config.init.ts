import { APP_INITIALIZER, Provider } from '@angular/core'
import { ConfigService } from '@/services/config.service'
import { UrlService } from '@/services/url.service'
import { forkJoin, tap } from 'rxjs'

export default {
  provide: APP_INITIALIZER,
  useFactory: (configService: ConfigService, urlService: UrlService) => {
    return () =>
      forkJoin([configService.load()]).pipe(
        tap(() => urlService.setConfigService(configService)),
        tap(() => urlService.prepareUrls())
      )
  },
  deps: [ConfigService, UrlService],
  multi: true,
} satisfies Provider
