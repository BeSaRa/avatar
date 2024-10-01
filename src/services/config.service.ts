import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, tap } from 'rxjs'
import { Config, ConfigType } from '@/constants/config'

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private http = inject(HttpClient)
  CONFIG: ConfigType = Config
  BASE_URL = ''

  load(): Observable<ConfigType> {
    return this.http
      .get<ConfigType>('resources/environment.json')
      .pipe(tap(res => (this.CONFIG = { ...this.CONFIG, ...res })))
      .pipe(tap(() => this.prepareBaseUrl()))
  }

  private prepareBaseUrl(): string {
    if (
      !Object.prototype.hasOwnProperty.call(this.CONFIG, 'ENVIRONMENTS_URLS') ||
      !Object.keys(this.CONFIG.ENVIRONMENTS_URLS).length
    ) {
      throw Error(
        'There is no ENVIRONMENTS_URLS Property or empty provided inside resources/environment.json file Kindly ' +
          'check it'
      )
    }

    if (typeof this.CONFIG.BASE_ENVIRONMENT === 'undefined') {
      throw Error('there is no BASE_ENVIRONMENT_INDEX provided inside resources/environment.json file')
    }

    if (
      typeof this.CONFIG.ENVIRONMENTS_URLS[
        this.CONFIG.BASE_ENVIRONMENT as unknown as keyof typeof this.CONFIG.ENVIRONMENTS_URLS
      ] === 'undefined'
    ) {
      throw Error(
        'the provided BASE_ENVIRONMENT not exists inside ENVIRONMENTS_URLS array in resources/environment.json file'
      )
    }
    this.BASE_URL =
      this.CONFIG.ENVIRONMENTS_URLS[
        this.CONFIG.BASE_ENVIRONMENT as unknown as keyof typeof this.CONFIG.ENVIRONMENTS_URLS
      ]

    if (Object.prototype.hasOwnProperty.call(this.CONFIG, 'API_VERSION') && this.CONFIG.API_VERSION) {
      if (this.BASE_URL.lastIndexOf('/') !== this.BASE_URL.length - 1) {
        this.BASE_URL += '/'
      }
      this.BASE_URL += this.CONFIG.API_VERSION
    }
    return this.BASE_URL
  }
}
