import { OnDestroy } from '@angular/core'
import { Subject } from 'rxjs'

export interface HasDestroySubjectContract extends OnDestroy {
  destroy$: Subject<void>
}
