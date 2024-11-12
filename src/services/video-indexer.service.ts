import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { VideoIndexerType } from '@/types/video-indexer-type'
import { AppStore } from '@/stores/app.store'
import { getState } from '@ngrx/signals'

@Injectable({
  providedIn: 'root',
})
export class VideoIndexerService {
  urlService = inject(UrlService)
  store = inject(AppStore)
  private readonly GENERAL_VIDEO_TOKEN = '00000000-0000-0000-0000-000000000000/c327efd5d7'
  buildVideoIndexerUrl(): VideoIndexerType {
    // #TODO refactor to build url dynamically
    const accessToken = getState(this.store).videoToken

    return {
      generic: {
        insights: `${this.urlService.URLS.VIDEO_INDEXER}/insights/${this.GENERAL_VIDEO_TOKEN}/?&locale=en`,
        player: `${this.urlService.URLS.VIDEO_INDEXER}/player/${this.GENERAL_VIDEO_TOKEN}/?&locale=en`,
      },
      custom: {
        insights: `${this.urlService.URLS.VIDEO_INDEXER}/insights/${accessToken}/?&locale=en`,
        player: `${this.urlService.URLS.VIDEO_INDEXER}/player/${accessToken}/?&locale=en`,
      },
    }
  }
}
