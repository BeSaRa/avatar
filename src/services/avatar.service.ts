import { inject, Injectable } from '@angular/core'
import { UrlService } from '@/services/url.service'
import { Observable, tap } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { StreamResultContract } from '@/contracts/stream-result-contract'
import { AppStore } from '@/stores/app.store'

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
    return this.http.post(this.urlService.URLS.AVATAR + `/render-text/${this.store.streamId()}`, { text })
  }

  updateVideo(text: string): Observable<unknown> {
    return this.http.patch(this.urlService.URLS.AVATAR + '/update-video', {}, { params: { text } })
  }

  retrieveVideo(): Observable<unknown> {
    return this.http.get(this.urlService.URLS.AVATAR + '/retrieve-video')
  }
}
