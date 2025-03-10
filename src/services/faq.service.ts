import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { HttpClient, HttpParams } from '@angular/common/http'
import { FAQContract } from '@/contracts/FAQ-contract'

@Injectable({
  providedIn: 'root',
})
export class FAQService {
  private readonly urlServices = inject(UrlService)
  private readonly http = inject(HttpClient)

  getQuestions(numberOfQuestoins: number, botName = 'website') {
    const url = `${this.urlServices.URLS.FAQ}/questions`
    const params = new HttpParams().append('n', numberOfQuestoins).append('bot_name', botName)
    return this.http.get<FAQContract[]>(url, { params: params })
  }
}
