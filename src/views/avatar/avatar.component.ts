import { Component, ElementRef, HostBinding, inject, signal } from '@angular/core'
import { AvatarVideoComponent } from '@/components/avatar-video/avatar-video.component'
import { OverlayChatComponent } from '@/components/overlay-chat/overlay-chat.component'
import { ScreenControlComponent } from '@/components/screen-control/screen-control.component'

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [AvatarVideoComponent, OverlayChatComponent, ScreenControlComponent],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export default class AvatarComponent {
  @HostBinding('attr.class')
  fullScreen = 'h-screen w-screen flex items-center justify-center'
  text = signal('')
  element: ElementRef<HTMLDivElement> = inject(ElementRef)

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
}
