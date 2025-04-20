import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { HttpClient, HttpParams } from '@angular/common/http'
import { MediaResultContract } from '@/contracts/media-result-contract'
import { Observable } from 'rxjs'
import { ChatMessageResultContract } from '@/contracts/chat-message-result-contract'
import { MediaCrawler } from '@/models/media-crawler'
import { GenerteReportContract } from '@/contracts/generate-report-contract'
import {
  MostIndexedUrlsContract,
  MostUsedKeywordsContract,
  NewsPercentageContract,
} from '@/contracts/statistics-contract'

@Injectable({
  providedIn: 'root',
})
export class WebCrawlerService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)

  generateReport(
    generateReportFilter: Partial<GenerteReportContract>
  ): Observable<
    MediaResultContract<{ final_response: ChatMessageResultContract; references: string[]; report_url: string }>
  > {
    const url = `${this.urlService.URLS.MEDIA}/generate-report`
    return this.http.post<
      MediaResultContract<{ final_response: ChatMessageResultContract; references: string[]; report_url: string }>
    >(url, generateReportFilter)
  }

  crawlWebPages(crawlingData: MediaCrawler): Observable<MediaResultContract> {
    const url = `${this.urlService.URLS.MEDIA}/crawl`
    return this.http.post<MediaResultContract>(url, crawlingData)
  }

  getMostIndexedStatistics(fromDate?: string, toDate?: string) {
    const url = `${this.urlService.URLS.MEDIA}/indexed-urls`
    let params = new HttpParams()
    if (fromDate) {
      params = params.set('from_date', fromDate)
    }
    if (toDate) {
      params = params.set('to_date', toDate)
    }
    return this.http.get<MostIndexedUrlsContract[]>(url, { params })
  }

  getMostUsedKeywordStatistics(fromDate?: string, toDate?: string) {
    const url = `${this.urlService.URLS.MEDIA}/used-keywords`
    let params = new HttpParams()
    if (fromDate) {
      params = params.set('from_date', fromDate)
    }
    if (toDate) {
      params = params.set('to_date', toDate)
    }
    return this.http.get<MostUsedKeywordsContract[]>(url, { params })
  }

  getIndexedNewsPercentage() {
    const url = `${this.urlService.URLS.MEDIA}/news-percentage`
    return this.http.get<NewsPercentageContract>(url)
  }
  getTotalNumberOfIndexedNews() {
    const url = `${this.urlService.URLS.MEDIA}/news-cards`
    return this.http.get<number>(url)
  }
}
