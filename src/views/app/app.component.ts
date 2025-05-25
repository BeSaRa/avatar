import { Component, effect, HostListener, inject } from '@angular/core'
import { RouterModule, RouterOutlet } from '@angular/router'
import { VersionComponent } from '@/components/version/version.component'
import { LocalPopupComponent } from '@/components/local-popup/local-popup.component'
import { MatDialog } from '@angular/material/dialog'
import { LocalService } from '@/services/local.service'
import { AppStore } from '@/stores/app.store'
import { CommonModule, DOCUMENT } from '@angular/common'
import { SidebarMenuComponent } from '@/components/sidebar-menu/sidebar-menu.component'
import { HeaderComponent } from '@/components/header/header.component'
import { ApplicationUserService } from '../auth/services/application-user.service'
import { BreadcrumbComponent } from '@/components/breadcrumb/breadcrumb.component'
import { MENU_ITEMS } from '../../resources/menu-items'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    VersionComponent,
    SidebarMenuComponent,
    HeaderComponent,
    RouterModule,
    BreadcrumbComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  dialog = inject(MatDialog)
  lang = inject(LocalService)
  store = inject(AppStore)
  document = inject(DOCUMENT)
  userService = inject(ApplicationUserService)
  storeEffect = effect(() => {
    this.document.body.style.setProperty('--app-primary-color', this.store.backgroundColor())
  })
  items = MENU_ITEMS

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
