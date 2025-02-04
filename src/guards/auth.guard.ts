import { ApplicationUserService } from '@/views/auth/services/application-user.service'
import { inject, Injectable } from '@angular/core'
import { CanActivate, Router, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  applicationUserService = inject(ApplicationUserService)
  router = inject(Router)
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.applicationUserService.$isAuthenticated()) {
      this.applicationUserService.tryAuthenticate()
    }

    return this.applicationUserService.$isAuthenticated()
  }
}
