import { VacationResultContract } from '@/contracts/vacation-result-contract'
import { VacationStatus } from '@/enums/vacation-status'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { InteractiveChatService } from '@/services/interactive-chat.service'
import { LocalService } from '@/services/local.service'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { DatePipe, NgClass } from '@angular/common'
import { Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatTooltipModule } from '@angular/material/tooltip'
import PerfectScrollbar from 'perfect-scrollbar'
import { takeUntil } from 'rxjs'

@Component({
  selector: 'app-vacation-list-popup',
  standalone: true,
  imports: [MatTooltipModule, DatePipe, CdkDrag, CdkDragHandle, MatDialogModule, NgClass],
  templateUrl: './vacation-list-popup.component.html',
  styleUrl: './vacation-list-popup.component.scss',
})
export class VacationListPopupComponent extends OnDestroyMixin(class {}) {
  vacationWrapper = viewChild<ElementRef<HTMLDivElement>>('vacationWrapper')
  lang = inject(LocalService)
  data = inject<VacationResultContract[] | { vacations: VacationResultContract[]; forEmployee: true }>(MAT_DIALOG_DATA)
  forEmployee = signal(false)
  vacations = signal<VacationResultContract[]>([])
  ref = inject(MatDialogRef)
  interactiveChatService = inject(InteractiveChatService)
  declare scrollbarRef: PerfectScrollbar

  /**
   *
   */
  constructor() {
    super()
    if (!Array.isArray(this.data)) {
      this.forEmployee.set(this.data.forEmployee)
      this.vacations.set(this.data.vacations)
    } else {
      this.vacations.set(this.data)
    }
  }
  chatBodyContainerEffect = effect(() => {
    if (this.vacationWrapper()) {
      this.scrollbarRef = new PerfectScrollbar(this.vacationWrapper()!.nativeElement, {
        wheelPropagation: false,
      })
    } else {
      this.scrollbarRef && this.scrollbarRef.destroy()
    }
  })

  isPending(element: VacationResultContract) {
    return element.Status === VacationStatus.PENDING
  }
  isApproved(element: VacationResultContract) {
    return element.Status === VacationStatus.APPROVED
  }
  isRejected(element: VacationResultContract) {
    return element.Status === VacationStatus.REJECTED
  }
  getStatus(element: VacationResultContract) {
    if (element.Status === VacationStatus.PENDING) return this.lang.locals.pending
    else if (element.Status === VacationStatus.APPROVED) return this.lang.locals.approved
    else return this.lang.locals.rejected
  }

  approveVacation(element: VacationResultContract) {
    this.interactiveChatService
      .handleVacationAction({ employee_ID: element.Employee_ID }, 'approve', VacationStatus.APPROVED)
      .pipe(takeUntil(this.destroy$))
      .subscribe()
  }

  rejectVacation(element: VacationResultContract) {
    this.interactiveChatService
      .handleVacationAction({ employee_ID: element.Employee_ID }, 'reject', VacationStatus.REJECTED)
      .pipe(takeUntil(this.destroy$))
      .subscribe()
  }

  pendingVacation(element: VacationResultContract) {
    this.interactiveChatService
      .handleVacationAction({ employee_ID: element.Employee_ID }, 'pending', VacationStatus.PENDING)
      .pipe(takeUntil(this.destroy$))
      .subscribe()
  }
}
