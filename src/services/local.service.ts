import { inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs'
import { UrlService } from '@/services/url.service'
import { LangKeysContract } from '@/contracts/lang-keys-contract'
import { DOCUMENT } from '@angular/common'
import { LocalContract } from '@/contracts/local-contract'

@Injectable({
  providedIn: 'root',
})
export class LocalService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)
  locals: LangKeysContract = {} as LangKeysContract
  private declare localization: Record<keyof LangKeysContract, { ar: string; en: string }>
  currentLanguage: 'ar' | 'en' = 'ar'
  localChange = signal<'ar' | 'en'>(this.currentLanguage)
  langChange$ = new BehaviorSubject<'ar' | 'en'>(this.currentLanguage)
  document = inject(DOCUMENT)
  private readonly localFile = '/resources/locals.json'

  constructor() {
    this.listenToLanguageChange()
  }

  load(): Observable<Record<keyof LangKeysContract, { ar: string; en: string }>> {
    return this.http
      .get<Record<keyof LangKeysContract, { ar: string; en: string }>>(this.localFile)
      .pipe(tap(res => (this.localization = res)))
      .pipe(tap(() => this.prepareCurrentLocal()))
  }

  prepareCurrentLocal(): void {
    Object.keys(this.localization).forEach(key => {
      this.locals[key as unknown as keyof LangKeysContract] =
        this.localization[key as unknown as keyof LangKeysContract][this.currentLanguage]
    })
    //
    this.locals = new Proxy(this.locals, {
      get(target: Record<keyof LangKeysContract, string>, p: keyof LangKeysContract): string {
        return target[p] ? target[p] : `[MISSING KEY]: ${p}`
      },
    })
  }

  private changeLanguage(lang: 'ar' | 'en'): void {
    this.currentLanguage = lang
    this.prepareCurrentLocal()
    this.langChange$.next(lang)
  }

  toggleLanguage(): void {
    this.changeLanguage(this.currentLanguage === 'ar' ? 'en' : 'ar')
  }

  private listenToLanguageChange() {
    this.langChange$.subscribe(lang => {
      console.log({ lang })
      this.document.dir = lang === 'ar' ? 'rtl' : 'ltr'
      const html = this.document.querySelector('html')
      html && (html.lang = lang)
      this.localChange.set(lang)
    })
  }

  createLocal(model: LocalContract): Observable<void> {
    return this.http
      .post<void>(this.urlService.URLS.LOCALS, model)
      .pipe(switchMap(value => this.load().pipe(map(() => value))))
  }
}
