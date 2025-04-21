import { ButtonDirective } from '@/directives/button.directive'
import { LocalService } from '@/services/local.service'
import { MessageService } from '@/services/message.service'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatTooltipModule } from '@angular/material/tooltip'
import { Router } from '@angular/router'
import { ApplicationUserService } from '../services/application-user.service'
import { finalize } from 'rxjs'
import { SpinnerLoaderComponent } from '@/components/spinner-loader/spinner-loader.component'

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  imports: [CommonModule, ButtonDirective, ReactiveFormsModule, MatTooltipModule, SpinnerLoaderComponent],
})
export class LoginComponent {
  lang = inject(LocalService)
  fb = inject(NonNullableFormBuilder)
  messagesService = inject(MessageService)
  userService = inject(ApplicationUserService)
  router = inject(Router)

  form = this.fb.group({
    userName: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
  })

  isLoading = false

  onSubmit() {
    if (this.form.invalid) {
      this.messagesService.showInfo('Please fill in all required fields correctly.')
      return
    }
    this.isLoading = true
    const { userName, password } = this.form.value
    this.userService
      .login(userName!, password!)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe()
  }
}
