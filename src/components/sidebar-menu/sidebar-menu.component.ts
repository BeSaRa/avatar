import { Component, inject } from '@angular/core'
import { MENU_ITEMS } from '../../resources/menu-items'
import { SVG_ICONS } from '@/constants/svg-icons'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { SanitizerPipe } from '@/pipes/sanitizer.pipe'
import { MatTooltip } from '@angular/material/tooltip'
import { LocalService } from '@/services/local.service'
import { ChatService } from '@/services/chat.service'
import { ApplicationUserService } from '@/views/auth/services/application-user.service'
import { MatDialog } from '@angular/material/dialog'
import { SettingsPopupComponent } from '../settings-popup/settings-popup.component'

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, SanitizerPipe, MatTooltip],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss',
})
export class SidebarMenuComponent {
  lang = inject(LocalService)
  chatService = inject(ChatService)
  applicationUserService = inject(ApplicationUserService)
  dialog = inject(MatDialog)

  readonly menuItems = MENU_ITEMS
  readonly svgIcons = SVG_ICONS

  isOpened = false

  get shownItems() {
    return this.menuItems.slice(0, 8)
  }

  get hiddenItems() {
    return this.menuItems.slice(8)
  }

  toggleFullMenu() {
    this.isOpened = !this.isOpened
  }

  getArrowIcon() {
    return this.lang.isLtr()
      ? this.isOpened
        ? this.svgIcons.ARROW_LEFT
        : this.svgIcons.ARROW_RIGHT
      : this.isOpened
        ? this.svgIcons.ARROW_RIGHT
        : this.svgIcons.ARROW_LEFT
  }

  toggleChat() {
    this.chatService.status.update(value => !value)
  }

  openSettings() {
    this.dialog.open(SettingsPopupComponent)
  }

  logout() {
    this.applicationUserService.logout()
  }
}
