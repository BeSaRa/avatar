import { inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { MENU_ITEMS } from '../resources/menu-items'
import { MenuItem } from '@/contracts/menu-item-contract'

@Injectable({
  providedIn: 'root',
})
export class BreadcumbService {
  private _router = inject(Router)
  private _routesMenuMap = MENU_ITEMS.reduce(
    (acc, cur) => {
      const route = cur.route.split('/').pop()!
      acc[route] = cur
      return acc
    },
    {} as Record<string, MenuItem>
  )

  getPathRoutes() {
    return this._router.url
      .split('/')
      .map(r => this._routesMenuMap[r])
      .filter(p => p)
  }
}
