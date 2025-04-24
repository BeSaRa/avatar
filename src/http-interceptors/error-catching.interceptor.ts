import { MessageService } from '@/services/message.service'
import { DOCUMENT } from '@angular/common'
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, throwError } from 'rxjs'
import { Router } from '@angular/router'
import { FAILURE_MESSAGE } from '@/http-contexts/failure-message-token'
import { LangKeysContract } from '@/contracts/lang-keys-contract'
import { LocalService } from '@/services/local.service'

export const errorCatchingInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService)
  const router = inject(Router)
  const doc = inject(DOCUMENT)
  const local = inject(LocalService)

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const customError = req.context.get(FAILURE_MESSAGE)
      console.error(error)
      if (error.status === 0) {
        const isOnline = doc.defaultView?.navigator.onLine
        switch (isOnline) {
          case true:
            messageService.showError('Error!!')
            break
          case false:
            messageService.showError('Network Error')
            break
        }
      } else if (customError) {
        messageService.showError(customError)
      } else {
        handelServerError(messageService, router, local, error)
      }
      return throwError(() => error)
    })
  )
}

const getErrorMessagePerCode = (errorCode: number, local: LocalService) => {
  const statusCodeToKey: Record<number, keyof LangKeysContract> = {
    400: 'bad_request',
    401: 'unauthorized',
    403: 'forbidden',
    404: 'not_found',
    409: 'conflict',
    422: 'unprocessable_entity',
    500: 'internal_server_error',
    502: 'bad_gateway',
    503: 'service_unavailable',
  }
  return local.locals[statusCodeToKey[errorCode]]
}

const handelServerError = (
  messageService: MessageService,
  router: Router,
  local: LocalService,
  error: HttpErrorResponse
) => {
  if (error.status === 401) {
    router.navigate(['auth/login'])
    return
  }
  const apiUrl = error.url?.split('/').slice(-2).join('/') ?? ''
  messageService.showError(getErrorMessagePerCode(error.status, local), apiUrl)
}
