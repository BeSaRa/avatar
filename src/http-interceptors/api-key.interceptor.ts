import { HttpInterceptorFn } from '@angular/common/http'
import { ConfigService } from '@/services/config.service'
import { inject } from '@angular/core'
import { finalize } from 'rxjs'
import { MessageService } from '@/services/message.service'
import { SHOW_SNACKBAR } from '@/http-contexts/show-snackbar'

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const configService = inject(ConfigService)
  const messageService = inject(MessageService)

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
  ).pipe(
    finalize(() => {
      if (req.context.has(SHOW_SNACKBAR)) {
        messageService.showInfo('Done successfully !')
      }
    })
  )
}
