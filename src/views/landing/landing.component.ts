import { Component, inject } from '@angular/core'
import { LocalService } from '@/services/local.service'
import { RouterLink } from '@angular/router'
import { ChatService } from '@/services/chat.service'
import { MENU_ITEMS } from '../../resources/menu-items'
import { SVG_ICONS } from '@/constants/svg-icons'
import { SanitizerPipe } from '@/pipes/sanitizer.pipe'

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, SanitizerPipe],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  lang = inject(LocalService)
  chatService = inject(ChatService)

  readonly menuItems = MENU_ITEMS
  readonly svgIcons = SVG_ICONS

  toggleChat() {
    this.chatService.status.update(value => !value)
  }
}
