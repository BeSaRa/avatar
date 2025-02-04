import { ApplicationUserService } from '@/views/auth/services/application-user.service'
import { Component, inject } from '@angular/core'
import { MatRipple } from '@angular/material/core'

@Component({
  selector: 'app-logout-button',
  templateUrl: 'logout-button.component.html',
  styleUrls: ['logout-button.component.scss'],
  standalone: true,
  imports: [MatRipple],
})
export class LogoutButtonComponent {
  applicationUserService = inject(ApplicationUserService)
  logout() {
    this.applicationUserService.logout()
  }
}
