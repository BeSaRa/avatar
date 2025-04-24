import { HttpInterceptorFn } from '@angular/common/http'
import { ConfigService } from '@/services/config.service'
import { inject } from '@angular/core'

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const configService = inject(ConfigService)

  return next(
    req.clone({
      setHeaders: {
        ...(configService.CONFIG.BASE_ENVIRONMENT === 'AQARAT_STG'
          ? {
              'x-functions-key': configService.CONFIG.KUNA,
            }
          : undefined),
      },
    })
  )
}
