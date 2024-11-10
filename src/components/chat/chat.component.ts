import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core'
import { MatRipple } from '@angular/material/core'
import { LocalService } from '@/services/local.service'
import { DOCUMENT } from '@angular/common'

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
  document = inject(DOCUMENT)
  lang = inject(LocalService)
  chatContainer = viewChild.required<ElementRef<HTMLDivElement>>('chatContainer')
  fullscreenStatus = signal(false)

  toggleChat() {
    this.status.update(value => !value)
  }

  fullScreenToggle() {
    if (!this.document.fullscreenElement) {
      this.chatContainer()
        .nativeElement.requestFullscreen()
        .then(() => this.fullscreenStatus.set(true))
    } else {
      this.document.exitFullscreen().then(() => this.fullscreenStatus.set(false))
    }
  }
}
