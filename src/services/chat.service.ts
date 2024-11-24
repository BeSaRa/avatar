import { inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { UrlService } from '@/services/url.service'
import { catchError, map, Observable } from 'rxjs'
import { Message } from '@/models/message'
import { AppStore } from '@/stores/app.store'
import { ChatMessageResultContract } from '@/contracts/chat-message-result-contract'
import { formatString, formatText } from '@/utils/utils'

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)
  private readonly store = inject(AppStore)
  messages = signal<Message[]>([])
  status = signal<boolean>(false)
  conversationId = signal<string>('')

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
