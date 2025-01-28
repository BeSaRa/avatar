import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { Permission } from '@/contracts/permission-contract'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)

  getAllPermission(): Observable<Permission[]> {
    const url = `${this.urlService.URLS.ADMIN}/permissions`
    return this.http.get<Permission[]>(url)
  }

  assignPermission(userId: string, permission: string[]) {
    const url = `${this.urlService.URLS.ADMIN}/permission/assign`
    const params = new HttpParams().append('user_id', userId)
    return this.http.post(url, permission, { params: params })
  }
  withdrawPermissions(userId: string, permissions: string[]) {
    const url = `${this.urlService.URLS.ADMIN}/permission/remove`
    const params = new HttpParams().append('user_id', userId)
    return this.http.delete(url, { params: params, body: permissions })
  }
  getUserPermission(userId: string): Observable<Permission[]> {
    const url = `${this.urlService.URLS.ADMIN}/user/${userId}/permissions`
    return this.http.get<Permission[]>(url)
  }
}
