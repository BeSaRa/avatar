import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { PaginationResultContract } from '@/contracts/pagination-result-contract'
import { SearchResultContract } from '@/contracts/search-result-contract'
import { SearchQueryContract } from '@/contracts/search-query-contract'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AiSearchService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)

  search(searchQuery: SearchQueryContract, bot: string): Observable<PaginationResultContract<SearchResultContract>> {
    const url = `${this.urlService.URLS.AI_SEARCH}/${bot}`
    return this.http.post<PaginationResultContract<SearchResultContract>>(url, searchQuery)
  }
}
