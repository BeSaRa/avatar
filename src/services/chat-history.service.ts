import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { Observable } from 'rxjs'
import { ConversationResultContract } from '@/contracts/conversation-result-contract'
import { ChatResultContract } from '@/contracts/chat-result-contract'

@Injectable({
  providedIn: 'root',
})
export class ChatHistoryService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)

  getAllConversations(): Observable<ConversationResultContract[]> {
    const url = `${this.urlService.URLS.CHAT_HISTORY}/get-all-conversations`
    return this.http.get<ConversationResultContract[]>(url)
  }
  getConversationsByUserId(userId: string): Observable<ConversationResultContract[]> {
    const url = `${this.urlService.URLS.CHAT_HISTORY}/get-conversations`
    const params = new HttpParams().set('user_id', userId)
    return this.http.get<ConversationResultContract[]>(url, { params: params })
  }

  getChatByConversationId(conversationId: string): Observable<ChatResultContract[]> {
    const url = `${this.urlService.URLS.CHAT_HISTORY}/get-chat`
    const params = new HttpParams().set('conv_id', conversationId)
    return this.http.get<ChatResultContract[]>(url, { params: params })
  }
  applyAnalysis(): Observable<string> {
    const url = `${this.urlService.URLS.CHAT_HISTORY}/semantic-analysis`
    return this.http.post<string>(url, null)
  }
  addFeedback(conversationId: string, feedback: number): Observable<string> {
    const url = `${this.urlService.URLS.CHAT_HISTORY}/add-feedback`
    const params = new HttpParams().set('conv_id', conversationId).set('feedback', feedback)
    return this.http.post<string>(url, null, { params: params })
  }
}
