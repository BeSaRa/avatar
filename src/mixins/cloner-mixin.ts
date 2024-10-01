import { AbstractConstructorType, ConstructorType } from '@/types/constructor-type'
import { CloneContract } from '@/contracts/clone-contract'

type CanClone = ConstructorType<CloneContract> & AbstractConstructorType<CloneContract>

export function ClonerMixin<T extends AbstractConstructorType<object>>(base: T): CanClone & T
export function ClonerMixin<T extends ConstructorType<object>>(base: T): CanClone & T {
  return class CanClone extends base implements CloneContract {
    clone<M extends object>(overrides?: Partial<M>): M {
      const constructor = this.constructor as ConstructorType<M>
      return Object.assign(new constructor(), this, overrides)
    }
  }
}
