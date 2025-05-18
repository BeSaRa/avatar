import { ApplicationUserService } from '@/views/auth/services/application-user.service'
import { NgIf } from '@angular/common'
import { Directive, effect, inject, input } from '@angular/core'
import { ALL_PERMISSIONS } from '../resources/all-permissions'

@Directive({
  selector: '[appHasPermission]',
  standalone: true,
  hostDirectives: [NgIf],
})
export class HasPermissionDirective {
  private readonly appicationUser = inject(ApplicationUserService).$applicationUser()
  private ngIf = inject(NgIf, { host: true })

  appHasPermission = input.required<(keyof typeof ALL_PERMISSIONS)[]>()
  showEffect = effect(
    () => {
      this.ngIf.ngIf = this.appicationUser.hasAllPermission(this.appHasPermission()!)
    },
    { allowSignalWrites: true }
  )
}
