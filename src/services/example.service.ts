import { Injectable } from '@angular/core'
import { BaseCrudService } from '@/abstracts/base-crud-service'
import { Example } from '@/models/example'
import { CastResponseContainer } from 'cast-response'

@CastResponseContainer({
  $default: {
    model: () => Example,
  },
})
@Injectable({
  providedIn: 'root',
})
export class ExampleService extends BaseCrudService<Example> {
  override serviceName = 'ExampleService'

  override getUrlSegment(): string {
    return this.urlService.URLS.EXAMPLES
  }
}
