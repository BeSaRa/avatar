import { ChatActionResultContract } from '@/contracts/chat-action-result-contract'
import { VacationResultContract } from '@/contracts/vacation-result-contract'
import { VacationStatus } from '@/enums/vacation-status'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { InteractiveChatService } from '@/services/interactive-chat.service'
import { LocalService } from '@/services/local.service'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { DatePipe, NgClass } from '@angular/common'
import { Component, effect, ElementRef, inject, viewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatTooltipModule } from '@angular/material/tooltip'
import PerfectScrollbar from 'perfect-scrollbar'
import { takeUntil, tap } from 'rxjs'

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
  data = inject<VacationResultContract[]>(MAT_DIALOG_DATA)
  ref = inject(MatDialogRef)
  interactiveChatService = inject(InteractiveChatService)
  declare scrollbarRef: PerfectScrollbar

  chatBodyContainerEffect = effect(() => {
    if (this.vacationWrapper()) {
      this.scrollbarRef = new PerfectScrollbar(this.vacationWrapper()!.nativeElement, { suppressScrollX: true })
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
      .approveVacation({ employee_ID: element.Employee_ID })
      .pipe(takeUntil(this.destroy$))
      .pipe(tap(res => this.handelVacationStatus(res, element.Employee_ID, VacationStatus.APPROVED)))
      .subscribe()
  }
  rejectVacation(element: VacationResultContract) {
    this.interactiveChatService
      .rejectVacation({ employee_ID: element.Employee_ID })
      .pipe(takeUntil(this.destroy$))
      .pipe(tap(res => this.handelVacationStatus(res, element.Employee_ID, VacationStatus.REJECTED)))
      .subscribe()
  }
  pendingVacation(element: VacationResultContract) {
    this.interactiveChatService
      .pendingVacation({ employee_ID: element.Employee_ID })
      .pipe(takeUntil(this.destroy$))
      .pipe(tap(res => this.handelVacationStatus(res, element.Employee_ID, VacationStatus.PENDING)))
      .subscribe()
  }

  changeStatus(elementId: number, status: VacationStatus) {
    const vacation = this.data.find(el => el.Employee_ID === elementId)
    if (vacation) {
      vacation.Status = status
    }
  }

  handelVacationStatus(res: ChatActionResultContract<string>, employeeId: number, status: VacationStatus) {
    if (res.status_code === 200) {
      this.changeStatus(employeeId, status)
    }
  }
}
