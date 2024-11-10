import { Component, computed, inject, signal } from '@angular/core'
import { MatRipple } from '@angular/material/core'
import { LocalService } from '@/services/local.service'

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MatRipple],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  status = signal(false)
  statusWord = computed(() => (this.status() ? 'opened' : 'closed'))
  lang = inject(LocalService)

  toggleChat() {
    this.status.update(value => !value)
  }
}
