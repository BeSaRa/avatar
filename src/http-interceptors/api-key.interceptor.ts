import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { ConfigService } from '@/services/config.service'

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const configService = inject(ConfigService)
  const config = configService.CONFIG

  const headers: Record<string, string> = {}

  if (config.IS_OCP) {
    const ocpKey = config.OCP_APIM_KEY[config.BASE_ENVIRONMENT]
    if (ocpKey) {
      headers['Ocp-Apim-Subscription-Key'] = ocpKey
    }
  }

  if (config.BASE_ENVIRONMENT === 'AQARAT_STG') {
    const functionsKey = config.KUNA
    if (functionsKey) {
      headers['x-functions-key'] = functionsKey
    }
  }

  const clonedRequest = req.clone({
    setHeaders: headers,
  })

  return next(clonedRequest)
}
