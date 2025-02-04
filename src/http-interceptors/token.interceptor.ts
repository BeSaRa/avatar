import { ApplicationUserService } from '@/views/auth/services/application-user.service'
import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { CONFIGURATIONS } from '../resources/configurations'

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const applicationUserService = inject(ApplicationUserService)

  return next(
    req.clone({
      setHeaders: {
        ...(applicationUserService.$applicationUser().hasToken()
          ? {
              [CONFIGURATIONS.TOKEN_HEADER_KEY]: `Bearer ${applicationUserService.$applicationUser().access_token}`,
            }
          : undefined),
      },
    })
  )
}
