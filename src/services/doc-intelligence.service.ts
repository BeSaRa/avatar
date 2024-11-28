import { DocumentIntelligenceContract } from '@/contracts/doc-intelligence-contract'
import { UrlService } from '@/services/url.service'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class DocIntelligenceService {
  http = inject(HttpClient)
  urlService = inject(UrlService)

  documentAnalyze(file: string): Observable<DocumentIntelligenceContract> {
    const url = `${this.urlService.URLS.DOC_INTELLIGENCE}/analyze-pdf`
    const formData = new FormData().append('file', file)
    return this.http.post<string>(url, formData).pipe(map(res => JSON.parse(res) as DocumentIntelligenceContract))
  }
}
