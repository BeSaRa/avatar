import { Component, inject, input } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { NgClass, NgOptimizedImage } from '@angular/common'
import { AppStore } from '@/stores/app.store'
import { LocalService } from '@/services/local.service'
import { getState } from '@ngrx/signals'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { MatDialog } from '@angular/material/dialog'
import { SettingsPopupComponent } from '@/components/settings-popup/settings-popup.component'
import { ChatComponent } from '@/components/chat/chat.component'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, RouterLinkActive, NgClass],
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
  chat = input.required<ChatComponent>()
  store = inject(AppStore)
  lang = inject(LocalService)
  settings = getState(this.store)
  dialog = inject(MatDialog)
  clonedSettings = structuredClone(this.settings)
  menuStatus: 'opened' | 'closed' = 'closed'
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
    this.chat().toggleChat()
  }
}
