import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { forkJoin, map, Observable, switchMap } from 'rxjs'
import { ConversationResultContract } from '@/contracts/conversation-result-contract'
import { ChatResultContract } from '@/contracts/chat-result-contract'
import { CastResponse } from 'cast-response'
import { Conversation } from '@/models/conversation'
import { HistoryMessage } from '@/models/history-message'
import { formatString, formatText, ignoreErrors } from '@/utils/utils'
import { FeedbackChat } from '@/enums/feedback-chat'
import { BaseChatService } from './base-chat.service'

@Injectable({
  providedIn: 'root',
})
export class ChatHistoryService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)
  private readonly baseChatService = inject(BaseChatService)

  @CastResponse(() => Conversation)
  getAllConversations(botName?: string): Observable<Conversation[]> {
    const url = `${this.urlService.URLS.CHAT_HISTORY}/all-conversations`
    let params = new HttpParams()
    if (botName) {
      params = params.set('bot_name', botName)
    }
    return this.http.get<Conversation[]>(url, { params: params })
  }
  getConversationsByUserId(userId: string): Observable<ConversationResultContract[]> {
    const url = `${this.urlService.URLS.CHAT_HISTORY}/conversations`
    const params = new HttpParams().set('user_id', userId)
    return this.http.get<ConversationResultContract[]>(url, { params: params })
  }

  getChatByConversationId(conversationId: string): Observable<HistoryMessage[]> {
    const url = `${this.urlService.URLS.CHAT_HISTORY}/chat`
    const params = new HttpParams().set('conv_id', conversationId)

    return this.http.get<ChatResultContract[]>(url, { params }).pipe(
      map(res => {
        return res.map(item => {
          // Construct and populate a HistoryMessage object
          const historyMessage = new HistoryMessage()
          historyMessage.context = item.context ? JSON.parse(item.context) : ''
          historyMessage.content = formatText(item.content, historyMessage)

          historyMessage.partitionKey = item.partitionKey
          historyMessage.rowKey = item.rowKey
          historyMessage.role = item.role
          return historyMessage
        })
      }),
      switchMap(messages => {
        // Process all messages' content using processFormattedText
        const processedMessages$ = messages.map(historyMessage =>
          this.baseChatService.processFormattedText(historyMessage.content).pipe(
            map(formattedText => {
              historyMessage.content = formatString(formattedText)
              return historyMessage
            })
          )
        )

        return forkJoin(processedMessages$)
      }),
      ignoreErrors()
    )
  }

  applyAnalysis(): Observable<string> {
    const url = `${this.urlService.URLS.CHAT_HISTORY}/sentiment-analysis`
    return this.http.post<string>(url, null)
  }
  addFeedback(conversationId: string, feedback: FeedbackChat): Observable<string> {
    const url = `${this.urlService.URLS.CHAT_HISTORY}/add-feedback`
    const params = new HttpParams().set('conv_id', conversationId).set('feedback', feedback)
    return this.http.post<string>(url, null, { params: params })
  }
  getAllBotNames(): Observable<string[]> {
    const url = `${this.urlService.URLS.CHAT_HISTORY}/bot-names`
    return this.http.get<string[]>(url)
  }
}
