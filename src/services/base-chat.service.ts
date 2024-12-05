import { ChatMessageResultContract } from '@/contracts/chat-message-result-contract'
import { Message } from '@/models/message'
import { AppStore } from '@/stores/app.store'
import { formatString, formatText } from '@/utils/utils'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable, WritableSignal } from '@angular/core'
import { Observable, catchError, map } from 'rxjs'
import { UrlService } from './url.service'

@Injectable({
  providedIn: 'root',
})
export abstract class BaseChatService {
  protected readonly http = inject(HttpClient)
  protected readonly urlService = inject(UrlService)
  protected readonly store = inject(AppStore)
  abstract messages: WritableSignal<Message[]>
  abstract status: WritableSignal<boolean>
  abstract conversationId: WritableSignal<string>

  sendMessage(content: string): Observable<ChatMessageResultContract> {
    this.messages.update(messages => [...messages, new Message(content, 'user')])
    return this.http
      .post<ChatMessageResultContract>(this.urlService.URLS.CHAT, {
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
}
