import { DocumentIntelligenceContract } from '@/contracts/doc-intelligence-contract'
import { UrlService } from '@/services/url.service'
import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class DocIntelligenceService {
  http = inject(HttpClient)
  urlService = inject(UrlService)

  documentAnalyze(file: File): Observable<DocumentIntelligenceContract> {
    const url = `${this.urlService.URLS.DOC_INTELLIGENCE}/analyze-pdf`
    const params = new HttpParams().append('model_id', 'TestMECC')
    const formData = new FormData()
    formData.append('file', file)
    return this.http.post<DocumentIntelligenceContract>(url, formData, { params })
  }
}
