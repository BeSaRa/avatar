import { VacationResultContract } from './../contracts/vacation-result-contract'
import { ChatActionResultContract } from '@/contracts/chat-action-result-contract'
import { inject, Injectable, signal, ViewContainerRef } from '@angular/core'
import { BaseChatService } from './base-chat.service'
import { Message } from '@/models/message'
import { ChatMessageResultContract } from '@/contracts/chat-message-result-contract'
import { formatString, formatText } from '@/utils/utils'
import { Observable, catchError, finalize, forkJoin, isObservable, map, of, switchMap, tap } from 'rxjs'
import { FunctionArguments, FunctionName } from '@/contracts/tool-call-contract'
import { RequestVacationPopupComponent } from '@/components/request-vacation-popup/request-vacation-popup.component'
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { VacationListPopupComponent } from '@/components/vacation-list-popup/vacation-list-popup.component'
import { VacationStatus } from '@/enums/vacation-status'

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
      .post<ChatMessageResultContract>(this.urlService.URLS.INTERACTIVE_CHAT, this.getChatPayload())
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
      approve: () =>
        this.handleVacationAction(args as FunctionArguments<'approve'>, 'approve', VacationStatus.APPROVED),
      reject: () => this.handleVacationAction(args as FunctionArguments<'reject'>, 'reject', VacationStatus.REJECTED),
      pending: () => this.handleVacationAction(args as FunctionArguments<'pending'>, 'pending', VacationStatus.PENDING),
      'submit-form': () => this.submitVactionRequest(),
      'get-all-vacation-forms': () => this.getAllVacations(),
      'filter-vacation-forms-by': () => this.filterForm(args as FunctionArguments<'filter-vacation-forms-by'>),
      'get-employee-vacation-forms': () =>
        this.getEmployeeVacations(args as FunctionArguments<'get-employee-vacation-forms'>),
      'get-employee-vacations-count': () =>
        this.getVacationsCount(args as FunctionArguments<'get-employee-vacations-count'>),
    }
    return actionMap[actionName](args)
  }

  filterForm(filter: FunctionArguments<'filter-vacation-forms-by'>) {
    const url = `${this.urlService.URLS.INTERACTIVE_ACTION}/filter-vacation-forms-by`
    return this.http
      .post<ChatActionResultContract<VacationResultContract[]>>(url, {
        arguments: filter,
        chat_payload: this.getChatPayload(),
      })
      .pipe(tap(res => this.openVacationListDialog(res.data.action_results)))
  }

  openVacationDialog(form: FunctionArguments<'fill_vacation_form'>) {
    this.dialog.closeAll()
    this.ref = this.dialog.open(RequestVacationPopupComponent, {
      ...this.defaultConfigActionDialog(),
      data: form,
    })
    this.bindDialogState(this.ref)
  }

  openVacationListDialog(vacations: VacationResultContract[], forEmployee = false) {
    this.dialog.closeAll()
    if (!vacations || !vacations.length || typeof vacations === 'string') return
    this.listRef = this.dialog.open(VacationListPopupComponent, {
      ...this.defaultConfigActionDialog(),
      data: forEmployee ? { vacations, forEmployee } : vacations,
      minWidth: '45vw',
    })

    this.bindDialogState(this.listRef)
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
        chat_payload: this.getChatPayload(),
      })
      .pipe(tap(() => this.ref?.close()))
  }

  getAllVacations(): Observable<ChatActionResultContract<VacationResultContract[]>> {
    const url = `${this.urlService.URLS.INTERACTIVE_ACTION}/get-all-vacation-forms`
    return this.http
      .post<ChatActionResultContract<VacationResultContract[]>>(url, this.getChatPayload())
      .pipe(tap(res => this.openVacationListDialog(res.data.action_results)))
  }

  getVacationsCount(employeeId: FunctionArguments<'get-employee-vacations-count'>) {
    const url = `${this.urlService.URLS.INTERACTIVE_ACTION}/get-employee-vacations-count`
    return this.http.post<ChatActionResultContract<number>>(url, {
      arguments: employeeId,
      chat_payload: this.getChatPayload(),
    })
  }

  getEmployeeVacations(employeeId: FunctionArguments<'get-employee-vacation-forms'>) {
    const url = `${this.urlService.URLS.INTERACTIVE_ACTION}/get-employee-vacation-forms`
    return this.http
      .post<ChatActionResultContract<VacationResultContract[]>>(url, {
        arguments: employeeId,
        chat_payload: this.getChatPayload(),
      })
      .pipe(tap(res => this.openVacationListDialog(res.data.action_results, true)))
  }

  approveVacation(employeeId: FunctionArguments<'approve'>): Observable<ChatActionResultContract<string>> {
    const url = `${this.urlService.URLS.INTERACTIVE_ACTION}/approve`
    return this.http.post<ChatActionResultContract<string>>(url, {
      arguments: employeeId,
      chat_payload: this.getChatPayload(),
    })
  }
  rejectVacation(employeeId: FunctionArguments<'reject'>): Observable<ChatActionResultContract<string>> {
    const url = `${this.urlService.URLS.INTERACTIVE_ACTION}/reject`
    return this.http.post<ChatActionResultContract<string>>(url, {
      arguments: employeeId,
      chat_payload: this.getChatPayload(),
    })
  }
  pendingVacation(employeeId: FunctionArguments<'pending'>): Observable<ChatActionResultContract<string>> {
    const url = `${this.urlService.URLS.INTERACTIVE_ACTION}/pending`
    return this.http.post<ChatActionResultContract<string>>(url, {
      arguments: employeeId,
      chat_payload: this.getChatPayload(),
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

  private getChatPayload() {
    return {
      messages: this.messages(),
      ...(this.store.streamId() ? { stream_id: this.store.streamId() } : null),
      ...(this.conversationId() ? { conversation_id: this.conversationId() } : null),
    }
  }
  private bindDialogState<TCmp>(ref: MatDialogRef<TCmp>) {
    ref.afterOpened().subscribe(() => this.isDialogOpened.set(true))
    ref.afterClosed().subscribe(() => this.isDialogOpened.set(false))
  }
  private defaultConfigActionDialog(): MatDialogConfig {
    return {
      position: {
        top: '50px',
        left: '650px',
      },
      hasBackdrop: false,
      disableClose: true,
    }
  }

  handleVacationAction(
    employeeId: FunctionArguments<'approve' | 'reject' | 'pending'>,
    action: Extract<FunctionName, 'approve' | 'reject' | 'pending'>,
    status: VacationStatus
  ): Observable<ChatActionResultContract<string>> {
    if (this.listRef && this.listRef.componentInstance) {
      const vacation = (this.listRef.componentInstance?.data as VacationResultContract[])?.find(
        el => el.Employee_ID === employeeId.employee_ID
      )

      if (vacation) {
        vacation.changeState = true

        return this[`${action}Vacation`](employeeId).pipe(
          tap(() => {
            vacation.Status = status
          }),
          finalize(() => {
            vacation.changeState = false
          })
        )
      }
    }

    return this[`${action}Vacation`](employeeId)
  }
}
