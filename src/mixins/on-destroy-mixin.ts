import { Subject } from 'rxjs'
import { HasDestroySubjectContract } from '@/contracts/has-destroy-subject-contract'
import { AbstractConstructorType, ConstructorType } from '@/types/constructor-type'

type CanDestroy = ConstructorType<HasDestroySubjectContract> & AbstractConstructorType<HasDestroySubjectContract>

export function OnDestroyMixin<T extends AbstractConstructorType<object>>(base: T): CanDestroy & T
export function OnDestroyMixin<T extends ConstructorType<object>>(base: T): CanDestroy & T {
  return class HasDestroySubject extends base implements HasDestroySubjectContract {
    destroy$: Subject<void> = new Subject<void>()

    ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
      this.destroy$.unsubscribe()
    }
  }
}
