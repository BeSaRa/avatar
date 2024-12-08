import { ChatActionResultContract } from '@/contracts/chat-action-result-contract'
import { inject, Injectable, signal, ViewContainerRef } from '@angular/core'
import { BaseChatService } from './base-chat.service'
import { Message } from '@/models/message'
import { ChatMessageResultContract } from '@/contracts/chat-message-result-contract'
import { formatString, formatText } from '@/utils/utils'
import { Observable, catchError, forkJoin, isObservable, map, of, switchMap, tap } from 'rxjs'
import { FunctionArguments, FunctionName } from '@/contracts/tool-call-contract'
import { RequestVacationPopupComponent } from '@/components/request-vacation-popup/request-vacation-popup.component'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { VacationResultContract } from '@/contracts/vacation-result-contract'
import { VacationListPopupComponent } from '@/components/vacation-list-popup/vacation-list-popup.component'

@Injectable({
  providedIn: 'root',
})
export class InteractiveChatService extends BaseChatService {
  messages = signal<Message[]>([])
  status = signal(false)
  conversationId = signal<string>('')
  private readonly dialog = inject(MatDialog)
  private ref?: MatDialogRef<RequestVacationPopupComponent>
  private listRef?: MatDialogRef<VacationListPopupComponent>
  isDialogOpened = signal(false)
  interactiveArea?: ViewContainerRef
  override sendMessage(content: string): Observable<ChatMessageResultContract> {
    this.messages.update(messages => [...messages, new Message(content, 'user')])
    return this.http
      .post<ChatMessageResultContract>(this.urlService.URLS.INTERACTIVE_CHAT, {
        messages: this.messages(),
        ...(this.conversationId() ? { conversation_id: this.conversationId() } : null),
      })
      .pipe(
        catchError(err => {
          new Message().clone({
            content: err.message,
            role: 'error',
          })
          throw new Error(err)
        })
      )
      .pipe(switchMap(res => this.handleToolCalls(res)))
      .pipe(
        map(res => {
          res.message.content = formatString(formatText(res.message.content, res.message))
          res.message = new Message().clone(res.message)
          this.conversationId.set(res.message.conversation_id)
          this.messages.update(messages => [...messages, res.message])
          return res
        })
      )
  }

  interactiveActions(actionName: FunctionName, args?: FunctionArguments<FunctionName>) {
    const actionMap: Record<
      FunctionName,
      (args?: FunctionArguments<FunctionName>) => void | Observable<ChatActionResultContract>
    > = {
      fill_vacation_form: () => this.openVacationDialog(args as FunctionArguments<'fill_vacation_form'>),
      approve: () => this.checkAndApprove(args as FunctionArguments<'approve'>),
      reject: () => this.checkAndReject(args as FunctionArguments<'reject'>),
      pending: () => this.checkAndPending(args as FunctionArguments<'pending'>),
      'submit-form': () => this.submitVactionRequest(),
      'get-all-vacation-forms': () => this.getAllVacations(),
    }
    return actionMap[actionName](args)
  }

  openVacationDialog(form: FunctionArguments<'fill_vacation_form'>) {
    if (this.ref) {
      this.ref.close()
    }
    this.ref = this.dialog.open(RequestVacationPopupComponent, {
      position: {
        top: '50px',
        left: '650px',
      },
      hasBackdrop: false,
      data: form,
      disableClose: true,
    })
    this.ref?.afterOpened().subscribe(() => {
      this.isDialogOpened.set(true)
    })
    this.ref?.afterClosed().subscribe(() => {
      this.isDialogOpened.set(false)
    })
  }

  openVacationListDialog(vacations: VacationResultContract[]) {
    if (this.listRef) {
      this.listRef.close()
    }
    this.listRef = this.dialog.open(VacationListPopupComponent, {
      minWidth: '45vw',
      position: {
        top: '50px',
        left: '650px',
      },
      hasBackdrop: false,
      data: vacations,
      disableClose: true,
    })
    this.listRef?.afterOpened().subscribe(() => {
      this.isDialogOpened.set(true)
    })
    this.listRef?.afterClosed().subscribe(() => {
      this.isDialogOpened.set(false)
    })
  }

  getAllVacationTypes(): Observable<string[]> {
    const url = `${this.urlService.URLS.INTERACTIVE}/vacation-types`
    return this.http.get<string[]>(url)
  }

  getDepartmentTypes(): Observable<string[]> {
    const url = `${this.urlService.URLS.INTERACTIVE}/department-types`
    return this.http.get<string[]>(url)
  }
  submitVactionRequest(): Observable<ChatActionResultContract<string>> {
    const data = this.ref?.componentInstance.vacationRequestForm.value as FunctionArguments<'fill_vacation_form'>
    const url = `${this.urlService.URLS.INTERACTIVE_ACTION}/submit-form`
    return this.http
      .post<ChatActionResultContract<string>>(url, {
        form: { ...data, status: 'PENDING' },
        chat_payload: {
          messages: this.messages(),
          ...(this.conversationId() ? { conversation_id: this.conversationId() } : null),
        },
      })
      .pipe(tap(() => this.ref?.close()))
  }

  getAllVacations(): Observable<ChatActionResultContract<VacationResultContract[]>> {
    const url = `${this.urlService.URLS.INTERACTIVE_ACTION}/get-all-vacation-forms`
    return this.http
      .post<ChatActionResultContract<VacationResultContract[]>>(url, {
        messages: this.messages(),
        ...(this.conversationId() ? { conversation_id: this.conversationId() } : null),
      })
      .pipe(tap(res => this.openVacationListDialog(res.data.action_results)))
  }

  checkAndApprove(employeeId: FunctionArguments<'approve'>) {
    if (this.listRef) {
      const vacation = this.listRef.componentInstance.data.find(el => el.Employee_ID === employeeId.employee_ID)
      if (vacation) this.listRef.componentInstance.approveVacation(vacation)
    } else this.approveVacation(employeeId)
  }
  checkAndReject(employeeId: FunctionArguments<'reject'>) {
    if (this.listRef) {
      const vacation = this.listRef.componentInstance.data.find(el => el.Employee_ID === employeeId.employee_ID)
      if (vacation) this.listRef.componentInstance.rejectVacation(vacation)
    } else this.rejectVacation(employeeId)
  }
  checkAndPending(employeeId: FunctionArguments<'pending'>) {
    if (this.listRef) {
      const vacation = this.listRef.componentInstance.data.find(el => el.Employee_ID === employeeId.employee_ID)
      if (vacation) this.listRef.componentInstance.pendingVacation(vacation)
    } else this.pendingVacation(employeeId)
  }

  approveVacation(employeeId: FunctionArguments<'approve'>): Observable<ChatActionResultContract<string>> {
    const url = `${this.urlService.URLS.INTERACTIVE_ACTION}/approve`
    return this.http.post<ChatActionResultContract<string>>(url, {
      arguments: employeeId,
      chat_payload: {
        messages: this.messages(),
        ...(this.conversationId() ? { conversation_id: this.conversationId() } : null),
      },
    })
  }
  rejectVacation(employeeId: FunctionArguments<'reject'>): Observable<ChatActionResultContract<string>> {
    const url = `${this.urlService.URLS.INTERACTIVE_ACTION}/reject`
    return this.http.post<ChatActionResultContract<string>>(url, {
      arguments: employeeId,
      chat_payload: {
        messages: this.messages(),
        ...(this.conversationId() ? { conversation_id: this.conversationId() } : null),
      },
    })
  }
  pendingVacation(employeeId: FunctionArguments<'pending'>): Observable<ChatActionResultContract<string>> {
    const url = `${this.urlService.URLS.INTERACTIVE_ACTION}/pending`
    return this.http.post<ChatActionResultContract<string>>(url, {
      arguments: employeeId,
      chat_payload: {
        messages: this.messages(),
        ...(this.conversationId() ? { conversation_id: this.conversationId() } : null),
      },
    })
  }

  private handleToolCalls(res: ChatMessageResultContract): Observable<ChatMessageResultContract> {
    if (res.message?.tool_calls?.length) {
      // Create Observables for all tool calls
      const toolCallObservables = res.message.tool_calls.map(toolCall => {
        const {
          function: { name, arguments: args },
        } = toolCall
        const actionResult = this.interactiveActions(name, args)

        // If the action returns an Observable, handle it
        if (isObservable(actionResult)) {
          return actionResult.pipe(map(action => this.transformActionResult(res, action)))
        }

        // If synchronous, wrap it as an Observable
        return of(this.transformActionResult(res, actionResult as unknown as ChatActionResultContract))
      })

      // Combine all tool call Observables into one stream
      return toolCallObservables.length > 1
        ? forkJoin(toolCallObservables).pipe(
            map(() => res) // Return the original response after handling all tool calls
          )
        : toolCallObservables[0]
    }

    // If no tool calls, return the original response as an Observable
    return of(res)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isActionResultContract(result: any): result is ChatActionResultContract {
    return result && result.data && result.data.final_message && result.data.final_message.message
  }
  private transformActionResult(
    res: ChatMessageResultContract,
    action: ChatActionResultContract | undefined
  ): ChatMessageResultContract {
    if (this.isActionResultContract(action)) {
      res.message = action.data.final_message.message // Replace message with final action message
    }
    return res
  }
}
