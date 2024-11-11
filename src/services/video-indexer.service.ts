import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { VideoIndexerType } from '@/types/video-indexer-type'

@Injectable({
  providedIn: 'root',
})
export class VideoIndexerService {
  urlService = inject(UrlService)
  private readonly accessToken!: string

  buildVideoIndexerUrl(): VideoIndexerType {
    // #TODO refactor to build url dynamically
    return {
      generic: {
        // eslint-disable-next-line max-len
        insights: `${this.urlService.URLS.VIDEO_INDEXER}/insights/00000000-0000-0000-0000-000000000000/c327efd5d7/?&locale=en`,
        // eslint-disable-next-line max-len
        player: `${this.urlService.URLS.VIDEO_INDEXER}/player/00000000-0000-0000-0000-000000000000/c327efd5d7/?&locale=en`,
      },
      custom: {
        insights: `${this.urlService.URLS.VIDEO_INDEXER}/insights/${this.accessToken}?&locale=en`,
        player: `${this.urlService.URLS.VIDEO_INDEXER}/player/${this.accessToken}?&locale=en`,
      },
    }
  }
}
