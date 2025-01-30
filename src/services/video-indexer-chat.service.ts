import { Injectable, signal } from '@angular/core'
import { BaseChatService } from './base-chat.service'
import { Message } from '@/models/message'
import { ChatMessageResultContract } from '@/contracts/chat-message-result-contract'
import { catchError, map, Observable, switchMap } from 'rxjs'
import { formatText, formatString } from '@/utils/utils'

@Injectable({
  providedIn: 'root',
})
export class VideoIndexerChatService extends BaseChatService {
  messages = signal<Message[]>([])
  status = signal(false)
  conversationId = signal('')

  override sendMessage(content: string, bot: string): Observable<ChatMessageResultContract> {
    const url = `${this.urlService.URLS.CHAT}/${bot}`
    this.messages.update(messages => [...messages, new Message(content, 'user')])
    return this.http
      .post<ChatMessageResultContract>(url, {
        messages: this.messages(),
        ...(this.store.streamId() ? { stream_id: this.store.streamId() } : null),
        ...(this.conversationId() ? { conversation_id: this.conversationId() } : null),
      })
      .pipe(
        catchError(err => {
          new Message().clone({
            content: err.message,
            role: 'error',
          })
          throw new Error(err)
        }),
        map(res => {
          // Apply initial formatting
          res.message.content = formatText(res.message.content, res.message)
          return res
        }),
        switchMap(res =>
          this.processFormattedText(res.message.content).pipe(
            map(formattedText => {
              res.message.content = formatString(formattedText)
              res.message = new Message().clone(res.message)
              this.messages.update(messages => [...messages, res.message])
              return res
            })
          )
        )
      )
  }
}
