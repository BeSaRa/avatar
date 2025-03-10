import { LocalService } from '@/services/local.service'
import { Component, inject } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatTooltipModule } from '@angular/material/tooltip'
import { take } from 'rxjs'
import { ApplicationUserService } from '../services/application-user.service'
import { Router } from '@angular/router'
import { MessageService } from '@/services/message.service'

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  imports: [ReactiveFormsModule, MatTooltipModule],
})
export class LoginComponent {
  lang = inject(LocalService)
  fb = inject(NonNullableFormBuilder)
  messagesService = inject(MessageService)
  form = this.fb.group({
    userName: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
  })
  userService = inject(ApplicationUserService)
  router = inject(Router)
  onSubmit() {
    if (this.form.invalid) {
      this.messagesService.showInfo('Please fill in all required fields correctly.')
      return
    }
    const { userName, password } = this.form.value
    this.userService.login(userName!, password!).pipe(take(1)).subscribe()
  }
}
