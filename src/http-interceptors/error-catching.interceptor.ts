import { MessageService } from '@/services/message.service'
import { DOCUMENT } from '@angular/common'
import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, throwError } from 'rxjs'
import { Router } from '@angular/router'

export const errorCatchingInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService)
  const doc = inject(DOCUMENT)
  const router = inject(Router)

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(error)
      if (error.status === HttpStatusCode.Unauthorized) {
        router.navigate(['/auth/login'])
      }
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
      } else {
        handelServerError(error)
      }
      return throwError(() => error)
    })
  )
}

const handelServerError = (error: HttpErrorResponse) => {
  const messageService = inject(MessageService)
  switch (error.status) {
    case 400:
    case 409:
    case 422:
      messageService.showError(error.error['message'])
      break
    case 401:
      messageService.showError('Not Auth')
      break

    case 403:
      messageService.showError('Forbidden')
      break

    case 404:
      messageService.showError('Not found')
      break

    case 500:
    case 502:
    case 503:
      messageService.showError('Internal Server Error')
      break

    default:
      break
  }
}
