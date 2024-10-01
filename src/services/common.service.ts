import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, tap } from 'rxjs'
import { UrlService } from '@/services/url.service'
import { SpeechTokenContract } from '@/contracts/speech-token-contract'
import { AppStore } from '@/stores/app.store'

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private readonly http = inject(HttpClient)
  private urlService = inject(UrlService)
  private readonly appStore = inject(AppStore)

  generateSpeechToken(): Observable<SpeechTokenContract> {
    return this.http
      .get<SpeechTokenContract>(this.urlService.URLS.SPEECH_TOKEN)
      .pipe(tap(res => this.appStore.updateSpeechToken(res)))
  }
}
