import { Component, inject } from '@angular/core'
import { ConfigService } from '@/services/config.service'

@Component({
  selector: 'app-version',
  standalone: true,
  imports: [],
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss'],
})
export class VersionComponent {
  config = inject(ConfigService)
}
