import { SettingsPopupComponent } from '@/components/settings-popup/settings-popup.component'
import { SVG_ICONS } from '@/constants/svg-icons'
import { ChatService } from '@/services/chat.service'
import { LocalService } from '@/services/local.service'
import { AppStore } from '@/stores/app.store'
import { ApplicationUserService } from '@/views/auth/services/application-user.service'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { NgClass, NgTemplateOutlet } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { getState } from '@ngrx/signals'
import { SanitizerPipe } from '../../pipes/sanitizer.pipe'
import { ALL_PERMISSIONS } from '../../resources/all-permissions'
import { MENU_ITEMS } from '../../resources/menu-items'
import { ButtonDirective } from '@/directives/button.directive'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ButtonDirective],
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
  chatService = inject(ChatService)
  store = inject(AppStore)
  lang = inject(LocalService)
  settings = getState(this.store)
  dialog = inject(MatDialog)
  userService = inject(ApplicationUserService)
  clonedSettings = structuredClone(this.settings)
  menuStatus: 'opened' | 'closed' = 'closed'
  menuItems = MENU_ITEMS
  headerItems = signal(Array.from({ length: this.menuItems.length + 2 }, (_, k) => k))
  SvgIcons = SVG_ICONS
  applicationUserService = inject(ApplicationUserService)
  applicationUser = this.applicationUserService.$applicationUser()
  private menuStatusMap = {
    opened: 'closed',
    closed: 'opened',
  }

  toggleMenu() {
    this.menuStatus = this.menuStatusMap[this.menuStatus as keyof typeof this.menuStatusMap] as 'opened' | 'closed'
  }

  openSettings($event: Event) {
    $event.preventDefault()
    this.dialog.open(SettingsPopupComponent)
  }

  openChatbot($event: Event) {
    $event.preventDefault()
    this.chatService.status.update(value => !value)
  }
  hasPermission(permissions: (keyof typeof ALL_PERMISSIONS)[]) {
    if (!this.applicationUser) return false
    return this.applicationUser.hasAnyPermission(permissions)
  }
}
