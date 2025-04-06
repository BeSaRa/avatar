import { SocialMeidaSearchItem } from '@/types/social-media-search-type'
import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class SocialMediaService {
  private readonly urlService = inject(UrlService)
  private readonly http = inject(HttpClient)

  Xsearch(xpressions: Partial<SocialMeidaSearchItem>[]) {
    const url = `${this.urlService.URLS.SOCIAL}/x-search`
    return this.http.post(url, xpressions)
  }
}
