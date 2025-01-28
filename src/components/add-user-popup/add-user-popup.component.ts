import { USERNAME_PATTERN } from '@/constants/username-pattern'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { LocalService } from '@/services/local.service'
import { UserService } from '@/services/user.service'
import { markAllControlsAsTouchedAndDirty } from '@/utils/utils'
import { NgClass } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { finalize, takeUntil } from 'rxjs'

@Component({
  selector: 'app-add-user-popup',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './add-user-popup.component.html',
  styleUrl: './add-user-popup.component.scss',
})
export class AddUserPopupComponent extends OnDestroyMixin(class {}) {
  ref = inject<MatDialogRef<AddUserPopupComponent>>(MatDialogRef)
  usernameControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern(USERNAME_PATTERN),
      Validators.minLength(3),
      Validators.maxLength(20),
    ],
  })
  lang = inject(LocalService)
  userService = inject(UserService)
  done = signal(false)

  addUser() {
    if (this.usernameControl.invalid) {
      markAllControlsAsTouchedAndDirty(this.usernameControl)
      return
    }
    const username = this.usernameControl.value
    this.userService
      .addUser(username)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.done.set(true)
          setTimeout(() => {
            this.ref.close()
          }, 1500)
        })
      )
      .subscribe()
  }

  cancel() {
    this.ref.close()
  }
}
