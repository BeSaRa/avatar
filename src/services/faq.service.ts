import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { HttpClient, HttpParams } from '@angular/common/http'
import { ArchiveFAQContract, FAQContract } from '@/contracts/FAQ-contract'
import { combineLatest, map } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class FAQService {
  private readonly urlServices = inject(UrlService)
  private readonly http = inject(HttpClient)

  getQuestions(numberOfQuestoins: number, botName = 'website') {
    const url = `${this.urlServices.URLS.FAQ}/faqs`
    const params = new HttpParams().append('n', numberOfQuestoins).append('bot_name', botName)
    return this.http.get<FAQContract[]>(url, { params: params })
  }

  get archiveUrl() {
    return `${this.urlServices.URLS.FAQ_ARCHIEVE}`
  }
  getAllFAQs(botName: string) {
    const url = `${this.urlServices.URLS.FAQ}/faqs`
    const params = new HttpParams().append('bot_name', botName)
    return this.http.get<FAQContract[]>(url, { params })
  }

  getArchivedFAQs(botName: string, limit?: number) {
    let params = new HttpParams().append('bot_name', botName)
    if (limit) params = params.append('limit', limit)
    return this.http.get<ArchiveFAQContract[]>(this.archiveUrl, { params })
  }

  addToArchivedFAQs(botName: string, faqs: FAQContract[]) {
    const params = new HttpParams().append('bot_name', botName)
    return this.http.post(this.archiveUrl, faqs, { params })
  }

  updateArchivedFAQs(rowKey: string, archivedFAQ: Partial<ArchiveFAQContract>) {
    const params = new HttpParams().append('row_key', rowKey)
    return this.http.put(this.archiveUrl, archivedFAQ, { params })
  }

  deleteFAQBulk(botName: string, archivedFAQs: ArchiveFAQContract[]) {
    const params = new HttpParams().append('bot_name', botName)
    return this.http.delete(this.archiveUrl, { body: archivedFAQs, params })
  }

  getUnArchivedFAQs(botName: string) {
    const allFAQs$ = this.getAllFAQs(botName)
    const archivedFAQs$ = this.getArchivedFAQs(botName)
    return combineLatest([allFAQs$, archivedFAQs$]).pipe(
      map(([allFAQs, archivedFAQs]) => allFAQs.filter(af => !archivedFAQs.some(arf => af.RowKey === arf.RowKey)))
    )
  }
}
