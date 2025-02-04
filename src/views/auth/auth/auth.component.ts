import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: 'auth.component.html',
  styleUrls: ['auth.component.scss'],
  imports: [RouterOutlet],
})
export default class AuthComponent {}
