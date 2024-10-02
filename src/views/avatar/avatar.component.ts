import { Component, HostBinding } from '@angular/core'
import { RecorderComponent } from '@/components/recorder/recorder.component'

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [RecorderComponent],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export default class AvatarComponent {
  @HostBinding('attr.class')
  fullScreen = 'h-screen w-screen flex items-center justify-center'
}
