import { HttpClient, HttpContext, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { User } from '@/contracts/user-contract'
import { Observable } from 'rxjs'
import { SHOW_SNACKBAR } from '@/http-contexts/show-snackbar'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)

  getAllUsers(): Observable<User[]> {
    const url = `${this.urlService.URLS.ADMIN}/users`
    return this.http.get<User[]>(url)
  }
  getUserById(userId: string): Observable<User> {
    const url = `${this.urlService.URLS.ADMIN}/user/${userId}`
    return this.http.get<User>(url)
  }
  addUser(username: string): Observable<void> {
    const url = `${this.urlService.URLS.ADMIN}/user`
    const params = new HttpParams().append('username', username)
    return this.http.post<void>(url, null, { params: params, context: new HttpContext().set(SHOW_SNACKBAR, true) })
  }
  deleteUser(userId: string): Observable<void> {
    const url = `${this.urlService.URLS.ADMIN}/user`
    const params = new HttpParams().append('user_id', userId)
    return this.http.delete<void>(url, { params: params })
  }
}
