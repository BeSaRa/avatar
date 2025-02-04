import { SettingsPopupComponent } from '@/components/settings-popup/settings-popup.component'
import { MENU_ITEMS } from '../../resources/menu-items'
import { ChatService } from '@/services/chat.service'
import { LocalService } from '@/services/local.service'
import { AppStore } from '@/stores/app.store'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { JsonPipe, NgClass, NgOptimizedImage } from '@angular/common'
import { Component, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { getState } from '@ngrx/signals'
import { SanitizerPipe } from '../../pipes/sanitizer.pipe'
import { SVG_ICONS } from '@/constants/svg-icons'
import { ApplicationUserService } from '@/views/auth/services/application-user.service'
import { ALL_PERMISSIONS } from '../../resources/all-permissions'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, RouterLinkActive, NgClass, JsonPipe, SanitizerPipe],
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
  clonedSettings = structuredClone(this.settings)
  menuStatus: 'opened' | 'closed' = 'closed'
  menuItems = MENU_ITEMS
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
