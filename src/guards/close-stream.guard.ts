import { CanDeactivateFn } from '@angular/router'
import { inject } from '@angular/core'
import { AppStore } from '@/stores/app.store'
import { AvatarService } from '@/services/avatar.service'

export const closeStreamGuard: CanDeactivateFn<unknown> = () => {
  const store = inject(AppStore)
  const avatarService = inject(AvatarService)
  if (store.streamId()) {
    avatarService.closeStream().subscribe()
  }
  return confirm('Stream will be closed')
}
