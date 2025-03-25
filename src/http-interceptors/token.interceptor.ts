import { ApplicationUserService } from '@/views/auth/services/application-user.service'
import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { CONFIGURATIONS } from '../resources/configurations'
import { NO_ACCESS_TOKEN } from '@/http-contexts/no-access-token'

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const applicationUserService = inject(ApplicationUserService)

  let _req = req
  if (!req.context.get(NO_ACCESS_TOKEN))
    _req = req.clone({
      setHeaders: {
        ...(applicationUserService.$applicationUser().hasToken()
          ? {
              [CONFIGURATIONS.TOKEN_HEADER_KEY]: `Bearer ${applicationUserService.$applicationUser().access_token}`,
            }
          : undefined),
      },
    })

  return next(_req)
}
