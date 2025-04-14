import { AvatarVideoComponent } from '@/components/avatar-video/avatar-video.component'
import { OverlayChatComponent } from '@/components/overlay-chat/overlay-chat.component'
import { ScreenControlComponent } from '@/components/screen-control/screen-control.component'
import { LocalService } from '@/services/local.service'
import { AppStore } from '@/stores/app.store'
import { CommonModule } from '@angular/common'
import { Component, ElementRef, HostBinding, inject, signal, viewChild } from '@angular/core'
import { MatTooltipModule } from '@angular/material/tooltip'
import { QRCodeComponent } from 'angularx-qrcode'

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [
    CommonModule,
    AvatarVideoComponent,
    OverlayChatComponent,
    ScreenControlComponent,
    QRCodeComponent,
    MatTooltipModule,
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export default class AvatarComponent {
  avatarVideoComponent = viewChild.required<AvatarVideoComponent>('avatarVideoComponent')

  @HostBinding('attr.class')
  fullScreen = 'h-screen w-screen flex items-center justify-center'
  text = signal('')
  element: ElementRef<HTMLDivElement> = inject(ElementRef)
  store = inject(AppStore)
  lang = inject(LocalService)

  settingsOpened = false
  qrCodeOpened = false

  recognizing(value: string) {
    this.text.set(value)
  }

  toggleFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().then()
    } else {
      this.element.nativeElement.requestFullscreen().then()
    }
  }

  toggleStream() {
    if (this.store.isStreamLoading()) return

    this.store.isStreamStopped() ? this.avatarVideoComponent().start$.next() : this.avatarVideoComponent().stop$.next()
  }

  toggleSettings() {
    this.settingsOpened = !this.settingsOpened
  }

  getQRData() {
    return `${location.host}/control?streamId=${this.store.streamId()}`
  }
}
