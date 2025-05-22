import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { HttpClient, HttpParams } from '@angular/common/http'
import { MediaResultContract } from '@/contracts/media-result-contract'
import { combineLatest, Observable } from 'rxjs'
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

  private buildParams(fromDate?: string, toDate?: string): HttpParams {
    let params = new HttpParams()
    if (fromDate) params = params.set('from_date', fromDate)
    if (toDate) params = params.set('to_date', toDate)
    return params
  }

  getMostIndexedStatistics(fromDate?: string, toDate?: string) {
    return this.http.get<MostIndexedUrlsContract[]>(`${this.urlService.URLS.MEDIA}/indexed-urls`, {
      params: this.buildParams(fromDate, toDate),
    })
  }

  getMostUsedKeywordStatistics(fromDate?: string, toDate?: string) {
    return this.http.get<MostUsedKeywordsContract[]>(`${this.urlService.URLS.MEDIA}/used-keywords`, {
      params: this.buildParams(fromDate, toDate),
    })
  }

  getIndexedNewsPercentage(fromDate?: string, toDate?: string) {
    return this.http.get<NewsPercentageContract>(`${this.urlService.URLS.MEDIA}/news-percentage`, {
      params: this.buildParams(fromDate, toDate),
    })
  }

  getTotalNumberOfIndexedNews(fromDate?: string, toDate?: string) {
    return this.http.get<number>(`${this.urlService.URLS.MEDIA}/news-cards`, {
      params: this.buildParams(fromDate, toDate),
    })
  }

  getStatistics(fromDate?: string, toDate?: string) {
    return combineLatest({
      mostIndexed: this.getMostIndexedStatistics(fromDate, toDate),
      mostKeywords: this.getMostUsedKeywordStatistics(fromDate, toDate),
      newsPercentage: this.getIndexedNewsPercentage(fromDate, toDate),
      totalIndexed: this.getTotalNumberOfIndexedNews(fromDate, toDate),
    })
  }
}
