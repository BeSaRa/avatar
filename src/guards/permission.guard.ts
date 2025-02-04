import { PermissionRouteData } from './../contracts/permission-rout-data'
import { ApplicationUserService } from '@/views/auth/services/application-user.service'
import { inject } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router'

export class PermissionGuard {
  static canActivate: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const applicationUserService = inject(ApplicationUserService)
    const hasPermission = this._hasPermission(applicationUserService, route.data as PermissionRouteData)

    if (!hasPermission) applicationUserService.logout()
    return hasPermission
  }

  private static _hasPermission(service: ApplicationUserService, permissionRouteData: PermissionRouteData): boolean {
    if (permissionRouteData.hasAnyPermission) {
      return service.$applicationUser().hasAnyPermission(permissionRouteData.permissions)
    }
    return service.$applicationUser().hasAllPermission(permissionRouteData.permissions)
  }
}
