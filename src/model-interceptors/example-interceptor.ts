import { ModelInterceptorContract } from 'cast-response'
import { Example } from '@/models/example'

export class ExampleInterceptor implements ModelInterceptorContract<Example> {
  send(model: Partial<Example>): Partial<Example> {
    console.log('SEND INTERCEPTOR for Example Model', model)
    return model
  }

  receive(model: Example): Example {
    console.log('RECEIVE INTERCEPTOR for Example Model', model)
    return model
  }
}
