import { BaseCrudModel } from '@/abstracts/base-crud-model'
import { ExampleService } from '@/services/example.service'
import { InterceptModel } from 'cast-response'
import { ExampleInterceptor } from '@/model-interceptors/example-interceptor'

const { send, receive } = new ExampleInterceptor()

@InterceptModel({ send, receive })
export class Example extends BaseCrudModel<Example, ExampleService> {
  override $$__service_name__$$ = 'ExampleService'
  name!: string
}
