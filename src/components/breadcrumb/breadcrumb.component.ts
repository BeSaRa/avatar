import { MenuItem } from '@/contracts/menu-item-contract'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { LocalService } from '@/services/local.service'
import { Component, computed, effect, inject, input, signal } from '@angular/core'
import { NavigationEnd, Router, RouterLink } from '@angular/router'
import { filter, takeUntil, tap } from 'rxjs'

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent extends OnDestroyMixin(class {}) {
  private _router = inject(Router)
  lang = inject(LocalService)

  menu = input.required<MenuItem[]>()

  private _routesMenuMap: Record<string, MenuItem> = {}

  private readonly url = signal(this._router.url)

  readonly pathRoutes = computed(() => {
    return this.url()
      .split('/')
      .map(part => this._routesMenuMap[part])
      .filter(Boolean)
  })

  constructor() {
    super()
    this._router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        tap(() => this.url.set(this._router.url)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        console.log('hee')
      })

    effect(() => {
      if (this.menu().length) {
        this._routesMenuMap = this.buildRouteMapFromMenu(this.menu())
      }
    })
  }

  buildRouteMapFromMenu(menuItems: MenuItem[]): Record<string, MenuItem> {
    const routeMap: Record<string, MenuItem> = {}

    for (const item of menuItems) {
      const routeKey = item.route.split('/').pop()!
      routeMap[routeKey] = item

      if (item.children?.length) {
        const childMap = this.buildRouteMapFromMenu(item.children)
        Object.assign(routeMap, childMap)
      }
    }

    return routeMap
  }
}
