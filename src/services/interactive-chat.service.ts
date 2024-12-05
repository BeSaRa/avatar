import { inject, Injectable, signal } from '@angular/core'
import { BaseChatService } from './base-chat.service'
import { Message } from '@/models/message'
import { ChatMessageResultContract } from '@/contracts/chat-message-result-contract'
import { formatString, formatText } from '@/utils/utils'
import { Observable, catchError, map, tap } from 'rxjs'
import { FunctionArguments, FunctionName } from '@/contracts/tool-call-contract'
import { RequestVacationPopupComponent } from '@/components/request-vacation-popup/request-vacation-popup.component'
import { MatDialog } from '@angular/material/dialog'

@Injectable({
  providedIn: 'root',
})
export class InteractiveChatService extends BaseChatService {
  messages = signal<Message[]>([])
  status = signal(false)
  conversationId = signal<string>('')
  private readonly dialog = inject(MatDialog)

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
      .pipe(
        tap(res => {
          if (res.message && res.message.tool_calls) {
            res.message.tool_calls.forEach(toolCall => {
              const {
                function: { name, arguments: args },
              } = toolCall

              this.interactiveActions(name, args)
            })
          }
        })
      )
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
    const actionMap: Record<FunctionName, (args?: FunctionArguments<FunctionName>) => void> = {
      fill_vacation_form: args => this.openVacationDialog(args as FunctionArguments<'fill_vacation_form'>),
      approve: () => console.log('Approve'),
      reject: () => console.log('Reject'),
      pending: () => console.log('Reject'),
    }
    return actionMap[actionName](args)
  }

  openVacationDialog(form: FunctionArguments<'fill_vacation_form'>) {
    this.dialog.open(RequestVacationPopupComponent, {
      width: '70vw',
      hasBackdrop: false,
      data: form,
      disableClose: true,
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
}
