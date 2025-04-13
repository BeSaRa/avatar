import { AgentChatMessageResultContract } from '@/contracts/agent-chat-message-result-contract'
import { AgentMessage } from '@/models/agent-message'
import { formatString, formatText } from '@/utils/utils'
import { Injectable, signal } from '@angular/core'
import { catchError, map } from 'rxjs'
import { BaseChatService } from './base-chat.service'

@Injectable({
  providedIn: 'root',
})
export class AgentChatService extends BaseChatService {
  messages = signal<AgentMessage[]>([])
  status = signal(false)
  conversationId = signal<string>('')

  sendUserMessage(content: string) {
    this.messages.update(messages => [...messages, new AgentMessage(content, 'user')])
    return (
      this.http
        .post<AgentChatMessageResultContract>(this.urlService.URLS.AGENT_CHAT + '/poc-agent', this.getChatPayload())
        .pipe(
          catchError(err => {
            new AgentMessage().clone({
              content: err.message,
              role: 'error',
            })
            throw new Error(err)
          })
        )
        // .pipe(switchMap(res => this.handleToolCalls(res)))
        .pipe(
          map(res => {
            const _message = new AgentMessage(formatString(formatText(res.items[0].text)), res.role, res.action_results)
            this.conversationId.set(res.conversation_id)
            this.messages.update(messages => [...messages, _message])
            return
          })
        )
    )
  }

  loadTaskStatus() {
    return this.http.get<string[]>(this.urlService.URLS.AGENT + '/task-status')
  }

  updateTaskStatus(task_id: string, new_status: string) {
    return this.http
      .post<AgentChatMessageResultContract>(
        `${this.urlService.URLS.AGENT}/action/poc-agent/update-task-status`,
        {},
        {
          params: {
            bot_name: 'poc-agent',
            task_id,
            new_status,
            conversation_id: this.conversationId(),
            stream_id: this.store.streamId(),
          },
        }
      )
      .pipe(
        map(res => {
          const _message = new AgentMessage(formatString(formatText(res.items[0].text)), res.role, res.action_results)
          this.conversationId.set(res.conversation_id)
          this.messages.update(messages => [...messages, _message])
          return
        })
      )
  }

  private getChatPayload() {
    return {
      messages: this.messages(),
      ...(this.store.streamId() ? { stream_id: this.store.streamId() } : null),
      ...(this.conversationId() ? { conversation_id: this.conversationId() } : null),
      ...(this.getUserId() ? { user_id: this.getUserId() } : null),
    }
  }
}
