import { inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { UrlService } from '@/services/url.service'
import { catchError, map, Observable } from 'rxjs'
import { Message } from '@/models/message'
import { AppStore } from '@/stores/app.store'
import { ChatMessageResultContract } from '@/contracts/chat-message-result-contract'
import { formatString } from '@/utils/utils'

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)
  private readonly store = inject(AppStore)
  messages = signal<Message[]>([])
  status = signal<boolean>(false)

  sendMessage(content: string): Observable<ChatMessageResultContract> {
    this.messages.update(messages => [...messages, new Message(content, 'user')])
    return this.http
      .post<ChatMessageResultContract>(this.urlService.URLS.CHAT, {
        messages: this.messages(),
        ...(this.store.streamId() ? { stream_id: this.store.streamId() } : null),
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
          res.message.content = formatString(this.formatText(res.message.content, res.message))
          res.message = new Message().clone(res.message)
          this.messages.update(messages => [...messages, res.message])
          return res
        })
      )
  }

  private formatText(text: string, message: Message): string {
    console.log('message', message)
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

    // Replace text between [ and ] with <a> tags
    formattedText = formattedText.replace(/\[(.*?)\]/g, (match, p1) => {
      const item = message.context.citations[Number(p1.replace(/[^0-9]/g, ''))]
      if (!item) {
        return match
      }
      const title = item.title
      const url = item.url

      // eslint-disable-next-line max-len
      return `<br /><small class="px-1 text-primary"><a target="_blank" href="${url}">${title}</a><i class="link-icon"></i></small>`
    })
    // text = text.replace(/\./g, '.<br>')

    // Return the formatted text
    return formattedText.trim()
  }
}
