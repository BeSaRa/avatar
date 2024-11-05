import { Component, HostListener, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { VersionComponent } from '@/components/version/version.component'
import { LocalPopupComponent } from '@/components/local-popup/local-popup.component'
import { MatDialog } from '@angular/material/dialog'
import { LocalService } from '@/services/local.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, VersionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  dialog = inject(MatDialog)
  lang = inject(LocalService)

  @HostListener('window:keyup.Control.Alt.a', ['$event'])
  @HostListener('window:keyup.Control.Alt.ش', ['$event'])
  openLocalDialog($event: Event): void {
    $event.preventDefault()
    this.dialog.open(LocalPopupComponent, {
      direction: document.dir as 'rtl' | 'ltr',
    })
  }

  @HostListener('window:keyup.Control.Alt.l', ['$event'])
  toggleLanguage(): void {
    this.lang.toggleLanguage()
  }
}
