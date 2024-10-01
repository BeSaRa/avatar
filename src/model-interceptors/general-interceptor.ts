import { GeneralInterceptorContract } from 'cast-response'

export class GeneralInterceptor implements GeneralInterceptorContract {
  // eslint-disable-next-line
  send(model: Partial<any>): Partial<any> {
    delete model['$$__service_name__$$']
    return model
  }

  // eslint-disable-next-line
  receive(model: any) {
    return model
  }
}
