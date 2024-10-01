import { Observable } from 'rxjs'
import { HasServiceMixin } from '@/mixins/has-service-mixin'
import { ClonerMixin } from '@/mixins/cloner-mixin'
import { BaseModelContract } from '@/contracts/base-model-contract'
import { CloneContract } from '@/contracts/clone-contract'
import { BaseCrudModelContract } from '@/contracts/base-crud-model-contract'
import { HasServiceNameContract } from '@/contracts/has-service-name-contract'
import { BaseCrudServiceContract } from '@/contracts/base-crud-service-contract'

export abstract class BaseCrudModel<
    Model,
    Service extends BaseCrudServiceContract<Model, PrimaryKey>,
    PrimaryKey = number,
  >
  extends HasServiceMixin(ClonerMixin(class {}))
  implements BaseModelContract, CloneContract, BaseCrudModelContract<Model, PrimaryKey>, HasServiceNameContract
{
  id!: PrimaryKey
  abstract override $$__service_name__$$: string

  create(): Observable<Model> {
    return this.$$getService$$<Service>().create(this as unknown as Model)
  }

  update(): Observable<Model> {
    return this.$$getService$$<Service>().update(this as unknown as Model)
  }

  delete(): Observable<Model> {
    return this.$$getService$$<Service>().delete(this.id)
  }

  save(): Observable<Model> {
    return this.id ? this.update() : this.create()
  }
}
