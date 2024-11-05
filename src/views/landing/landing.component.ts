import { Component, inject } from '@angular/core'
import { LocalService } from '@/services/local.service'

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  lang = inject(LocalService)
}
