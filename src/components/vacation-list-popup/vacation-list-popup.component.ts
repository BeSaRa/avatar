import { ChatActionResultContract } from '@/contracts/chat-action-result-contract'
import { VacationResultContract } from '@/contracts/vacation-result-contract'
import { VacationStatus } from '@/enums/vacation-status'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { Message } from '@/models/message'
import { InteractiveChatService } from '@/services/interactive-chat.service'
import { LocalService } from '@/services/local.service'
import { formatString, formatText } from '@/utils/utils'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { DatePipe, NgClass } from '@angular/common'
import { Component, effect, ElementRef, inject, viewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatTooltipModule } from '@angular/material/tooltip'
import PerfectScrollbar from 'perfect-scrollbar'
import { map, takeUntil, tap } from 'rxjs'

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
    element.changeState = true
    this.interactiveChatService
      .approveVacation({ employee_ID: element.Employee_ID })
      .pipe(takeUntil(this.destroy$))
      .pipe(tap(res => this.handelVacationStatus(res, element.Employee_ID, VacationStatus.APPROVED)))
      .pipe(
        map(res => {
          res.data.final_message.message.content = formatString(
            formatText(res.data.final_message.message.content, res.data.final_message.message)
          )
          res.data.final_message.message = new Message().clone(res.data.final_message.message)
          this.interactiveChatService.conversationId.set(res.data.final_message.message.conversation_id)
          this.interactiveChatService.messages.update(messages => [...messages, res.data.final_message.message])
        })
      )
      .subscribe(() => (element.changeState = false))
  }
  rejectVacation(element: VacationResultContract) {
    element.changeState = true
    this.interactiveChatService
      .rejectVacation({ employee_ID: element.Employee_ID })
      .pipe(takeUntil(this.destroy$))
      .pipe(tap(res => this.handelVacationStatus(res, element.Employee_ID, VacationStatus.REJECTED)))
      .pipe(
        map(res => {
          res.data.final_message.message.content = formatString(
            formatText(res.data.final_message.message.content, res.data.final_message.message)
          )
          res.data.final_message.message = new Message().clone(res.data.final_message.message)
          this.interactiveChatService.conversationId.set(res.data.final_message.message.conversation_id)
          this.interactiveChatService.messages.update(messages => [...messages, res.data.final_message.message])
        })
      )
      .subscribe(() => (element.changeState = false))
  }
  pendingVacation(element: VacationResultContract) {
    element.changeState = true
    this.interactiveChatService
      .pendingVacation({ employee_ID: element.Employee_ID })
      .pipe(takeUntil(this.destroy$))
      .pipe(tap(res => this.handelVacationStatus(res, element.Employee_ID, VacationStatus.PENDING)))
      .pipe(
        map(res => {
          res.data.final_message.message.content = formatString(
            formatText(res.data.final_message.message.content, res.data.final_message.message)
          )
          res.data.final_message.message = new Message().clone(res.data.final_message.message)
          this.interactiveChatService.conversationId.set(res.data.final_message.message.conversation_id)
          this.interactiveChatService.messages.update(messages => [...messages, res.data.final_message.message])
        })
      )
      .subscribe(() => (element.changeState = false))
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
