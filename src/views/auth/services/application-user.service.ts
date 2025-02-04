import { inject, Injectable, signal } from '@angular/core'
import { ApplicationUser } from '../models/application-user'
import { UrlService } from '@/services/url.service'
import { HttpClient } from '@angular/common/http'
import { catchError, Observable, of, tap } from 'rxjs'
import { Router } from '@angular/router'
import { STORAGE_ITEMS } from '@/constants/storage-items'
import { CONFIGURATIONS } from '../../../resources/configurations'

@Injectable({
  providedIn: 'root',
})
export class ApplicationUserService {
  private readonly _http = inject(HttpClient)
  private readonly _urlService = inject(UrlService)
  private readonly _router = inject(Router)
  $applicationUser = signal<ApplicationUser>(new ApplicationUser())
  $isAuthenticated = signal<boolean>(false)

  login(username: string, password: string): Observable<ApplicationUser> {
    const url = `${this._urlService.URLS.USER}/login`
    const body = new URLSearchParams({
      username,
      password,
    }).toString()

    const options = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }

    return this._http.post<ApplicationUser>(url, body, options).pipe(
      tap(res =>
        this.$applicationUser.update(state => {
          state.access_token = res.access_token
          state.refresh_token = res.refresh_token
          state.permissions = res.permissions
          return state
        })
      ),
      tap(res => localStorage.setItem(STORAGE_ITEMS.USER, JSON.stringify(res))),
      tap(res =>
        localStorage.setItem(
          STORAGE_ITEMS.PERMISSIONS_KEYS,
          JSON.stringify(res.permissions.map(p => p._Permission__key))
        )
      ),
      tap(() => this.$isAuthenticated.set(true)),
      tap(() => this._router.navigate(['/home'])),
      catchError(() => {
        this.$isAuthenticated.set(false)
        return of(new ApplicationUser())
      })
    )
  }
  generateRefreshToken() {
    const url = `${this._urlService.URLS.USER}/refresh-token`
    this.$applicationUser().isRefreshing.set(true)
    const options = { headers: { [CONFIGURATIONS.TOKEN_HEADER_KEY]: this.$applicationUser().refresh_token } }
    return this._http.get<{ refresh_token: string }>(url, options).pipe(
      tap(res =>
        this.$applicationUser.update(state => {
          state.refresh_token = res.refresh_token
          return state
        })
      ),
      tap(() => this.$applicationUser().isRefreshing.set(false)),
      catchError(() => {
        this.$applicationUser().isRefreshing.set(false)
        return of({ refresh_token: '' })
      })
    )
  }
  generateAccessToken() {
    const url = `${this._urlService.URLS.USER}/access-token`
    const options = { headers: { [CONFIGURATIONS.TOKEN_HEADER_KEY]: this.$applicationUser().access_token } }
    return this._http.get<{ access_token: string }>(url, options).pipe(
      tap(
        res =>
          this.$applicationUser.update(state => {
            state.access_token = res.access_token
            return state
          }),
        catchError(() => {
          this._router.navigate(['/auth/login'])
          return of({ access_token: '' })
        })
      )
    )
  }

  tryAuthenticate() {
    const user = localStorage.getItem(STORAGE_ITEMS.USER)
    if (user)
      this.$applicationUser.update(state => {
        const userObj = JSON.parse(user)
        state.access_token = userObj.access_token
        state.refresh_token = userObj.refresh_token
        state.permissions = userObj.permissions
        return state
      })
    this.$isAuthenticated.set(!!user)
    !this.$isAuthenticated() && this._router.navigate(['/auth/login'])
  }
  logout(): void {
    this.$isAuthenticated.set(false)
    this.$applicationUser.set(new ApplicationUser())
    localStorage.removeItem(STORAGE_ITEMS.USER)
    this._router.navigate(['/auth/login'])
  }
}
