import { AbstractConstructorType, ConstructorType } from '@/types/constructor-type'
import { HasServiceNameContract } from '@/contracts/has-service-name-contract'
import { ServiceRegistry } from '@/services/service-registry'

type CanGetService = ConstructorType<HasServiceNameContract> & AbstractConstructorType<HasServiceNameContract>

export function HasServiceMixin<M extends AbstractConstructorType<object>>(base: M): CanGetService & M
export function HasServiceMixin<M extends ConstructorType<object>>(base: M): CanGetService & M {
  return class HasService extends base implements HasServiceNameContract {
    $$__service_name__$$!: string

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(args)
    }

    $$getService$$<S>(): S {
      return ServiceRegistry.get<S>(this.$$__service_name__$$)
    }
  }
}
