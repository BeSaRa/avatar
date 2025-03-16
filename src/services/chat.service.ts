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
}
