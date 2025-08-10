import { StreamResultContract } from '@/contracts/stream-result-contract'
import { NO_ACCESS_TOKEN } from '@/http-contexts/no-access-token'
import { UrlService } from '@/services/url.service'
import { AppStore } from '@/stores/app.store'
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http'
import { inject, Injectable, NgZone } from '@angular/core'
import { map, Observable, of, switchMap, tap, timer } from 'rxjs'
import { ConfigService } from './config.service'

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private readonly urlService = inject(UrlService)
  private readonly http = inject(HttpClient)
  private readonly store = inject(AppStore)
  private readonly config = inject(ConfigService)
  private readonly zone = inject(NgZone)

  constructor() {
    if (!this.store.idleAvatar()) this.store.updateIdleAvatar(this.config.CONFIG.IDLE_AVATARS[0])
  }

  startStream(size?: 'life-size', updateStreamId = true, clientId?: string): Observable<StreamResultContract> {
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
            ...(clientId
              ? {
                  client_id: clientId,
                }
              : undefined),
          },
        }
      )
      .pipe(tap(res => updateStreamId && this.store.updateStreamId(res.data.id)))
  }

  connect(): Observable<string> {
    if (this.store.clientId()) {
      return of(this.store.clientId())
    }
    return this.http.post<{ client_id: string }>(this.urlService.URLS.AVATAR + '/connect', null).pipe(
      map(res => res.client_id),
      tap(id => this.store.updateClientId(id))
    )
  }

  startListener(clientId: string) {
    return new Observable<StreamResultContract>(observer => {
      const eventSource = new EventSource(this.urlService.URLS.AVATAR + `/start-listener/${clientId}`)

      eventSource.onmessage = event => {
        this.zone.run(() => {
          observer.next(JSON.parse(event.data))
        })
      }

      eventSource.onerror = error => {
        this.zone.run(() => {
          observer.error(error)
        })
        eventSource.close()
      }

      return () => eventSource.close()
    })
  }

  closeStream(): Observable<StreamResultContract> {
    const streamId = this.store.streamId()
    this.store.updateStreamId('')
    return this.http.delete<StreamResultContract>(this.urlService.URLS.AVATAR + `/close-stream/${streamId}`)
  }

  retrieveStream() {
    return this.http.get(this.urlService.URLS.AVATAR + `/retrieve-stream/${this.store.streamId()}`)
  }

  checkStreamStatus() {
    return this.http.get(this.urlService.URLS.AVATAR + `/stream-status/${this.store.streamId()}`)
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
    return this.http.post(this.urlService.URLS.AVATAR + `/render-text/${this.store.streamId()}`, { text })
  }

  updateVideo(text: string): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(this.urlService.URLS.AVATAR + '/update-video', { text })
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
