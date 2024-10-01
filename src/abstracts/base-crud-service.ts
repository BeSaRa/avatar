import { BaseCrudServiceContract } from '@/contracts/base-crud-service-contract'
import { OptionsContract } from '@/contracts/options-contract'
import { Observable } from 'rxjs'
import { inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { UrlService } from '@/services/url.service'
import { CastResponse, HasInterception, InterceptParam } from 'cast-response'
import { ServiceContract } from '@/contracts/service-contract'
import { RegisterServiceMixin } from '@/mixins/register-service-mixin'

export abstract class BaseCrudService<Model, PrimaryKey = number>
  extends RegisterServiceMixin(class {})
  implements BaseCrudServiceContract<Model, PrimaryKey>, ServiceContract
{
  abstract serviceName: string

  abstract getUrlSegment(): string

  protected urlService = inject(UrlService)
  protected http = inject(HttpClient)

  @CastResponse()
  load(options?: OptionsContract | undefined): Observable<Model[]> {
    return this.http.get<Model[]>(this.getUrlSegment(), {
      params: new HttpParams({
        fromObject: options as never,
      }),
    })
  }

  @CastResponse()
  @HasInterception
  create(@InterceptParam() model: Model): Observable<Model> {
    return this.http.post<Model>(this.getUrlSegment(), model)
  }

  @CastResponse()
  @HasInterception
  update(@InterceptParam() model: Model): Observable<Model> {
    return this.http.put<Model>(this.getUrlSegment(), model)
  }

  @CastResponse()
  delete(id: PrimaryKey): Observable<Model> {
    return this.http.delete<Model>(this.getUrlSegment() + '/' + id)
  }

  @CastResponse()
  getById(id: PrimaryKey): Observable<Model> {
    return this.http.get<Model>(this.getUrlSegment() + '/' + id)
  }
}
