import { CanDeactivateFn } from '@angular/router'
import { inject } from '@angular/core'
import { AppStore } from '@/stores/app.store'
import { AvatarService } from '@/services/avatar.service'
import { ApplicationUserService } from '@/views/auth/services/application-user.service'

export const closeStreamGuard: CanDeactivateFn<unknown> = () => {
  const store = inject(AppStore)
  const avatarService = inject(AvatarService)
  const userService = inject(ApplicationUserService)
  if (store.streamId() && userService.$isAuthenticated()) {
    avatarService.closeStream().subscribe()
  }
  return userService.$isAuthenticated() ? confirm('Stream will be closed') : true
}
