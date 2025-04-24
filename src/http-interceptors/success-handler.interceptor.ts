import { SHOW_SNACKBAR } from '@/http-contexts/show-snackbar'
import { SUCCESS_MESSAGE } from '@/http-contexts/success-message-token'
import { LocalService } from '@/services/local.service'
import { MessageService } from '@/services/message.service'
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http'
import { inject } from '@angular/core'
import { tap } from 'rxjs'

export const successHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService)
  const local = inject(LocalService)

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const showMessage = req.context.get(SHOW_SNACKBAR)
        if ([200, 201, 204].includes(event.status) && showMessage) {
          const customMessage = req.context.get(SUCCESS_MESSAGE)
          if (customMessage) {
            messageService.showInfo(customMessage)
          } else {
            messageService.showInfo(local.locals.operation_success)
          }
        }
      }
    })
  )
}
