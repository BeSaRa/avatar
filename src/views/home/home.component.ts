import { ChatComponent } from '@/components/chat/chat.component'
import { LocalService } from '@/services/local.service'
import { AppStore } from '@/stores/app.store'
import { Component, ElementRef, inject, viewChild } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  host: {
    '[class.flex]': 'true',
    '[class.w-full]': 'true',
    '[class.h-full]': 'true',
  },
})
export default class HomeComponent {
  store = inject(AppStore)
  lang = inject(LocalService)
  main = viewChild.required<ElementRef<HTMLDivElement>>('main')
}
