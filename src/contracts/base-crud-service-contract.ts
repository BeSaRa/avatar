import { Observable } from 'rxjs'
import { OptionsContract } from '@/contracts/options-contract'

export interface BaseCrudServiceContract<Model, PrimaryKeyType = number> {
  getUrlSegment(): string

  load(options?: OptionsContract): Observable<Model[]>

  create(model: Model): Observable<Model>

  update(model: Model): Observable<Model>

  delete(id: PrimaryKeyType): Observable<Model>

  getById(id: PrimaryKeyType): Observable<Model>
}
