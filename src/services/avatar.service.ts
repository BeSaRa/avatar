import { StreamResultContract } from '@/contracts/stream-result-contract'
import { NO_ACCESS_TOKEN } from '@/http-contexts/no-access-token'
import { UrlService } from '@/services/url.service'
import { AppStore } from '@/stores/app.store'
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable, of, switchMap, tap, timer } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private readonly urlService = inject(UrlService)
  private readonly http = inject(HttpClient)
  private readonly store = inject(AppStore)

  startStream(size?: 'life-size'): Observable<StreamResultContract> {
    return this.http
      .post<StreamResultContract>(
        this.urlService.URLS.AVATAR + '/start-stream',
        {},
        {
          params: {
            ...(size
              ? {
                  size: 'life-size',
                }
              : undefined),
          },
        }
      )
      .pipe(tap(res => this.store.updateStreamId(res.data.id)))
  }

  closeStream(): Observable<StreamResultContract> {
    const streamId = this.store.streamId()
    this.store.updateStreamId('')
    return this.http.delete<StreamResultContract>(this.urlService.URLS.AVATAR + `/close-stream/${streamId}`)
  }

  sendCandidate(candidate: RTCIceCandidate): Observable<StreamResultContract> {
    return this.http.post<StreamResultContract>(
      this.urlService.URLS.AVATAR + `/send-candidate/${this.store.streamId()}`,
      { candidate }
    )
  }

  sendAnswer(answer: RTCSessionDescriptionInit): Observable<StreamResultContract> {
    return this.http.put<StreamResultContract>(this.urlService.URLS.AVATAR + `/send-answer/${this.store.streamId()}`, {
      answer,
    })
  }

  interruptAvatar(): Observable<StreamResultContract> {
    return this.http.delete<StreamResultContract>(this.urlService.URLS.AVATAR + `/stop-render/${this.store.streamId()}`)
  }

  renderText(text: string): Observable<unknown> {
    return this.http.post(
      this.urlService.URLS.AVATAR + `/render-text/${this.store.streamId()}`,
      {},
      { params: { text } }
    )
  }

  updateVideo(text: string): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(this.urlService.URLS.AVATAR + '/update-video', {}, { params: { text } })
  }

  retrieveVideo(): Observable<string> {
    return this.http.get<{ status: string; data: string }>(this.urlService.URLS.AVATAR + '/retrieve-video').pipe(
      switchMap(res => {
        if (res.status === 'RENDERING') {
          return timer(5000).pipe(switchMap(() => this.retrieveVideo()))
        }
        return of(res.data)
      })
    )
  }

  greeting(botName: string, isArabic: boolean) {
    const url = `${this.urlService.URLS.AVATAR}/greeting/${botName}/${this.store.streamId()}`
    const params = new HttpParams().append('is_ar', isArabic)
    return this.http.post<void>(url, null, { params })
  }

  getMSICEServerInfo() {
    return this.http.get<{
      Urls: string[]
      Username: string
      Password: string
      ExpiresIn: number
    }>(`https://${this.store.speechToken.region()}.tts.speech.microsoft.com/cognitiveservices/avatar/relay/token/v1`, {
      context: new HttpContext().set(NO_ACCESS_TOKEN, true),
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.store.speechToken.token()}`),
    })
  }
}
