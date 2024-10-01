import { AbstractConstructorType, ConstructorType } from '@/types/constructor-type'
import { ServiceRegistry } from '@/services/service-registry'

export function RegisterServiceMixin<T extends AbstractConstructorType<object>>(base: T): T
export function RegisterServiceMixin<T extends ConstructorType<object>>(base: T): T {
  return class BaseServiceMixin extends base {
    serviceName!: string

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(args)
      this.$__init__$()
    }

    private $__init__$() {
      Promise.resolve().then(() => {
        ServiceRegistry.set(this.serviceName, this)
      })
    }
  }
}
