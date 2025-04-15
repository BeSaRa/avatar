import { AvatarVideoComponent } from '@/components/avatar-video/avatar-video.component'
import { LocalService } from '@/services/local.service'
import { AppStore } from '@/stores/app.store'
import { CommonModule } from '@angular/common'
import { Component, ElementRef, HostBinding, inject, signal, viewChild } from '@angular/core'
import { MatTooltipModule } from '@angular/material/tooltip'
import { Router } from '@angular/router'
import { QRCodeComponent } from 'angularx-qrcode'

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule, AvatarVideoComponent, QRCodeComponent, MatTooltipModule],
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
  router = inject(Router)

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
    return `${this.getOrigin()}/control?streamId=${this.store.streamId()}`
  }

  getOrigin() {
    const idx = location.href.lastIndexOf(this.router.url)
    return location.href.slice(0, idx)
  }
}
