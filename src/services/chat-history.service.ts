import { ChatResultContract } from '@/contracts/chat-result-contract'
import { ConversationResultContract } from '@/contracts/conversation-result-contract'
import { FeedbackChat } from '@/enums/feedback-chat'
import { Conversation } from '@/models/conversation'
import { HistoryMessage } from '@/models/history-message'
import { formatString, formatText, ignoreErrors } from '@/utils/utils'
import { HttpClient, HttpParams } from '@angular/common/http'
import { computed, inject, Injectable, signal } from '@angular/core'
import { CastResponse } from 'cast-response'
import { map, Observable, of, tap } from 'rxjs'
import { UrlService } from './url.service'

@Injectable({
  providedIn: 'root',
})
export class ChatHistoryService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)

  private _botNames: string[] = []

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

    return this.http
      .get<ChatResultContract[]>(url, { params })
      .pipe(
        map(res => {
          return res.map(item => {
            // Construct and populate a HistoryMessage object
            const historyMessage = new HistoryMessage()
            historyMessage.context = item.context && JSON.parse(item.context)
            historyMessage.content = formatString(formatText(item.content, historyMessage))
            historyMessage.partitionKey = item.partitionKey
            historyMessage.rowKey = item.rowKey
            historyMessage.role = item.role
            return historyMessage
          })
        })
      )
      .pipe(ignoreErrors())
  }

  applyAnalysis(): Observable<string> {
    const url = `${this.urlService.URLS.CHAT_HISTORY}/sentiment-analysis`
    return this.http.post<string>(url, null)
  }
  addFeedback(conversationId: string, feedback: FeedbackChat): Observable<string> {
    const url = `${this.urlService.URLS.CHAT_HISTORY}/add-conversation-feedback`
    const params = new HttpParams().set('conv_id', conversationId).set('feedback', feedback)
    return this.http.post<string>(url, null, { params: params })
  }

  getAllBotNames(): Observable<string[]> {
    const url = `${this.urlService.URLS.CHAT_HISTORY}/bot-names`
    return this._botNames.length
      ? of(this._botNames)
      : this.http.get<string[]>(url).pipe(tap(names => (this._botNames = names)))
  }
}
