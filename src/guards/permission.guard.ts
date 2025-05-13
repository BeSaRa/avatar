import { MessageService } from '@/services/message.service'
import { PermissionRouteData } from './../contracts/permission-rout-data'
import { ApplicationUserService } from '@/views/auth/services/application-user.service'
import { inject } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router'
import { LocalService } from '@/services/local.service'

export class PermissionGuard {
  static canActivate: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const applicationUserService = inject(ApplicationUserService)
    const messageService = inject(MessageService)
    const lang = inject(LocalService)

    const hasPermission = this._hasPermission(applicationUserService, route.data as PermissionRouteData)

    if (!hasPermission) {
      messageService.showError(lang.locals.you_dont_have_permission_to_access_this_page)
    }

    return hasPermission
  }

  private static _hasPermission(service: ApplicationUserService, permissionRouteData: PermissionRouteData): boolean {
    if (permissionRouteData.hasAnyPermission) {
      return service.$applicationUser().hasAnyPermission(permissionRouteData.permissions)
    }
    return service.$applicationUser().hasAllPermission(permissionRouteData.permissions)
  }
}
