import { distinctUntilChanged, tap } from 'rxjs'
import { Injectable, signal } from '@angular/core'
import { Message } from '@/models/message'
import { BaseChatService } from './base-chat.service'
import { FormControl } from '@angular/forms'

@Injectable({
  providedIn: 'root',
})
export class ChatService extends BaseChatService {
  messages = signal<Message[]>([])
  status = signal<boolean>(false)
  conversationId = signal<string>('')
  botNameCtrl = new FormControl('website', { nonNullable: true })

  onBotNameChange() {
    return this.botNameCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      tap(() => {
        this.conversationId.set('')
        this.messages.set([])
      })
    )
  }
}
