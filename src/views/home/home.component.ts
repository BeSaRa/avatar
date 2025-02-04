import { Component, ElementRef, inject, OnInit, viewChild } from '@angular/core'
import { AppStore } from '@/stores/app.store'
import { HeaderComponent } from '@/components/header/header.component'
import { LocalService } from '@/services/local.service'
import PerfectScrollbar from 'perfect-scrollbar'
import { RouterOutlet } from '@angular/router'
import { ChatComponent } from '@/components/chat/chat.component'
import { AvatarVideoComponent } from '@/components/avatar-video/avatar-video.component'
import { LogoutButtonComponent } from '@/components/logout-button/logout-button.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, ChatComponent, AvatarVideoComponent, LogoutButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  host: {
    '[class.flex]': 'true',
    '[class.w-full]': 'true',
    '[class.h-full]': 'true',
  },
})
export default class HomeComponent implements OnInit {
  store = inject(AppStore)
  lang = inject(LocalService)
  main = viewChild.required<ElementRef<HTMLDivElement>>('main')
  declare scrollRef: PerfectScrollbar

  ngOnInit(): void {
    this.scrollRef = new PerfectScrollbar(this.main().nativeElement)
  }
}
