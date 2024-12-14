import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { HttpClient } from '@angular/common/http'
import { MediaResultContract } from '@/contracts/media-result-contract'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class WebCrawlerService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)

  generateReport(text: string): Observable<MediaResultContract<{ report_url: string }>> {
    const url = `${this.urlService.URLS.MEDIA}/search`
    return this.http.post<MediaResultContract<{ report_url: string }>>(url, {
      search_text: text,
    })
  }

  crawlWebPages(crawlingData: { topics: string[]; urls: string[] }): Observable<MediaResultContract> {
    const url = `${this.urlService.URLS.MEDIA}/crawl`
    return this.http.post<MediaResultContract>(url, {
      ...crawlingData,
    })
  }
}
