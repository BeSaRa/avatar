import { Component, inject } from '@angular/core'
import { LocalService } from '@/services/local.service'
import { RouterLink } from '@angular/router'
import { ChatService } from '@/services/chat.service'

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  lang = inject(LocalService)
  chatService = inject(ChatService)
  toggleChat() {
    this.chatService.status.update(value => !value)
  }
}
