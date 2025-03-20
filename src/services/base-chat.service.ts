import { ChatMessageResultContract } from '@/contracts/chat-message-result-contract'
import { Message } from '@/models/message'
import { AppStore } from '@/stores/app.store'
import { formatString, formatText } from '@/utils/utils'
import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable, WritableSignal } from '@angular/core'
import { Observable, catchError, distinctUntilChanged, forkJoin, map, of, tap, exhaustMap } from 'rxjs'
import { UrlService } from './url.service'
import { AdminService } from './admin.service'
import { FormControl } from '@angular/forms'
import { MediaResultContract } from '@/contracts/media-result-contract'

@Injectable({
  providedIn: 'root',
})
export abstract class BaseChatService {
  protected readonly http = inject(HttpClient)
  protected readonly urlService = inject(UrlService)
  private readonly adminService = inject(AdminService)
  protected readonly store = inject(AppStore)
  readonly botNameCtrl = new FormControl('', { nonNullable: true })
  abstract messages: WritableSignal<Message[]>
  abstract status: WritableSignal<boolean>
  abstract conversationId: WritableSignal<string>

  sendMessage(content: string, bot: string): Observable<ChatMessageResultContract> {
    const url = `${this.urlService.URLS.CHAT}/${bot}`
    this.messages.update(messages => [...messages, new Message(content, 'user')])

    return this.http
      .post<ChatMessageResultContract>(url, {
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
        }),
        map(res => {
          res.message.content = formatString(formatText(res.message.content, res.message))
          res.message = new Message().clone(res.message)
          this.conversationId.set(res.message.conversation_id)
          this.messages.update(messages => [...messages, res.message])
          return res
        })
      )
  }

  processFormattedText(formattedText: string) {
    const matches = [...formattedText.matchAll(/href="(.*?)"/g)]

    // Handle empty matches
    if (matches.length === 0) {
      console.log('No matches found in formatted text.')
      return of(formattedText) // Return the unmodified text as an Observable
    }

    const replacementObservables = matches.map(match => {
      const url = match[1]

      if (url.includes('blob.core.windows.net')) {
        // Fetch API result for URLs containing the sequence
        return this.adminService.secureUrl(url).pipe(
          map(apiResponse => {
            return {
              match: match[0],
              replacement: match[0].replace(url, apiResponse), // Replace the original encoded URL
            }
          }),
          catchError(() => {
            return of({
              match: match[0],
              replacement: match[0], // Keep the original if there's an error
            })
          })
        )
      }
      // If no API call is needed, return the original
      return of({
        match: match[0],
        replacement: match[0],
      })
    })

    return forkJoin(replacementObservables).pipe(
      map(replacements => {
        replacements.forEach(({ match, replacement }) => {
          formattedText = formattedText.replace(match, replacement)
        })
        return formattedText
      })
    )
  }

  onBotNameChange() {
    return this.botNameCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      tap(() => {
        this.conversationId.set('')
        this.messages.set([])
      })
    )
  }

  uploadDocument(
    files: FileList,
    bot_name: string,
    conversation_id: string | null
  ): Observable<ChatMessageResultContract> {
    const url = `${this.urlService.URLS.CHATBOT_UPLOAD_DOCUMENT}`
    const formData = new FormData()

    Array.from(files).forEach(file => {
      formData.append('files', file, file.name)
    })

    let params = new HttpParams().set('bot_name', bot_name)
    if (conversation_id) {
      params = params.set('conversation_id', conversation_id)
    }

    return this.http.post<MediaResultContract<string>>(url, formData, { params }).pipe(
      map(response => {
        this.conversationId.set(response.data || '')
        return response.data
      }),
      exhaustMap(() =>
        this.sendMessage('summarize', bot_name).pipe(
          catchError(err => {
            console.error('Error sending summarize message:', err)
            throw err
          })
        )
      ),
      catchError(err => {
        console.error('Error uploading document:', err)
        throw err
      })
    )
  }
}
