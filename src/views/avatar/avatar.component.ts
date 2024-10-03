import { Component, ElementRef, HostBinding, inject, signal } from '@angular/core'
import { RecorderComponent } from '@/components/recorder/recorder.component'
import { AvatarVideoComponent } from '@/components/avatar-video/avatar-video.component'
import { OverlayChatComponent } from '@/components/overlay-chat/overlay-chat.component'
import { ChatService } from '@/services/chat.service'

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [RecorderComponent, AvatarVideoComponent, OverlayChatComponent],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export default class AvatarComponent {
  @HostBinding('attr.class')
  fullScreen = 'h-screen w-screen flex items-center justify-center'
  text = signal('')
  chatService = inject(ChatService)
  element: ElementRef<HTMLDivElement> = inject(ElementRef)

  pressDoneCallback(value: string): void {
    this.text.set(value)
    this.chatService.sendMessage(value).subscribe()
  }

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
