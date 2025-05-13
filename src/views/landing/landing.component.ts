import { SVG_ICONS } from '@/constants/svg-icons'
import { SanitizerPipe } from '@/pipes/sanitizer.pipe'
import { ChatService } from '@/services/chat.service'
import { LocalService } from '@/services/local.service'
import { MenuService } from '@/services/menu.service'
import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'

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
  menuService = inject(MenuService)

  readonly svgIcons = SVG_ICONS

  toggleChat() {
    this.chatService.status.update(value => !value)
  }
}
