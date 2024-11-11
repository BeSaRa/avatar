import { Component, effect, HostListener, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { VersionComponent } from '@/components/version/version.component'
import { LocalPopupComponent } from '@/components/local-popup/local-popup.component'
import { MatDialog } from '@angular/material/dialog'
import { LocalService } from '@/services/local.service'
import { AppStore } from '@/stores/app.store'
import { DOCUMENT } from '@angular/common'

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
  store = inject(AppStore)
  document = inject(DOCUMENT)
  storeEffect = effect(() => {
    this.document.body.style.setProperty('--app-primary-color', this.store.backgroundColor())
  })

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
