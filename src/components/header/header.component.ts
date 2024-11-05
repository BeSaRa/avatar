import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgOptimizedImage } from '@angular/common'
import { AppStore } from '@/stores/app.store'
import { LocalService } from '@/services/local.service'
import { getState } from '@ngrx/signals'
import { animate, state, style, transition, trigger } from '@angular/animations'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    '[class.w-full]': 'true',
  },
  animations: [
    trigger('menu', [
      state(
        'opened',
        style({
          height: '*',
        })
      ),
      state(
        'closed',
        style({
          height: '0',
        })
      ),
      transition('opened <=> closed', animate('250ms ease-in-out')),
    ]),
  ],
})
export class HeaderComponent {
  store = inject(AppStore)
  lang = inject(LocalService)
  settings = getState(this.store)
  clonedSettings = structuredClone(this.settings)
  menuStatus: 'opened' | 'closed' = 'closed'
  private menuStatusMap = {
    opened: 'closed',
    closed: 'opened',
  }

  toggleMenu() {
    this.menuStatus = this.menuStatusMap[this.menuStatus as keyof typeof this.menuStatusMap] as 'opened' | 'closed'
  }
}
