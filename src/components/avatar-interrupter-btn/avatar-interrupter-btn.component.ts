import { AvatarService } from '@/services/avatar.service'
import { LocalService } from '@/services/local.service'
import { Component, inject } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { take } from 'rxjs'

@Component({
  selector: 'app-avatar-interrupter-btn',
  standalone: true,
  imports: [MatTooltip],
  templateUrl: './avatar-interrupter-btn.component.html',
  styleUrl: './avatar-interrupter-btn.component.scss',
})
export class AvatarInterrupterBtnComponent {
  avatarService = inject(AvatarService)
  lang = inject(LocalService)
  interruptAvatar() {
    this.avatarService.interruptAvatar().pipe(take(1)).subscribe()
  }
}
