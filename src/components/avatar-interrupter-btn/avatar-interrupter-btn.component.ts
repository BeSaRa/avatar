import { AvatarService } from '@/services/avatar.service'
import { LocalService } from '@/services/local.service'
import { Component, EventEmitter, inject, input, Output } from '@angular/core'
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
  isDefault = input<boolean>(true)
  disabled = input<boolean>(false)
  @Output() interrupt = new EventEmitter<void>()

  avatarService = inject(AvatarService)
  lang = inject(LocalService)
  interruptAvatar() {
    if (this.isDefault()) this.avatarService.interruptAvatar().pipe(take(1)).subscribe()
    else this.interrupt.emit()
  }
}
