import { Observable } from 'rxjs'

export interface BaseCrudModelContract<Model, PrimaryKey> {
  id: PrimaryKey
  create(): Observable<Model>

  update(): Observable<Model>

  delete(): Observable<Model>

  save(): Observable<Model>
}
