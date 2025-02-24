import { inject, Injectable, signal } from '@angular/core'
import { Message } from '@/models/message'
import { BaseChatService } from './base-chat.service'
import { LocalService } from './local.service'
@Injectable({
  providedIn: 'root',
})
export class ChatService extends BaseChatService {
  messages = signal<Message[]>([])
  status = signal<boolean>(false)
  conversationId = signal<string>('')
  lang = inject(LocalService)

  checkInteractivity() {
    if (!this.store.isInteracted() && this.status()) {
      setTimeout(() => {
        this.messages.update(messages => [...messages, new Message(this.lang.locals.bot_welcom_message, 'assistant')])
        this.store.updateInteractioinWithChat(true)
      })
    }
  }
}
