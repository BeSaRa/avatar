import { inject, Injectable } from '@angular/core'
import { MENU_ITEMS } from '../resources/menu-items'
import { ApplicationUserService } from '@/views/auth/services/application-user.service'

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  applicationUserService = inject(ApplicationUserService)

  private readonly _menuItems = MENU_ITEMS

  getMenuItems() {
    return this._menuItems.filter(item =>
      item.permissions.length ? this.applicationUserService.$applicationUser().hasAllPermission(item.permissions) : true
    )
  }

  getHomeItems() {
    return this.getMenuItems().filter(el => el.label != 'home')
  }
}
