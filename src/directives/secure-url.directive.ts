import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { AdminService } from '@/services/admin.service'
import { DOCUMENT } from '@angular/common'
import { Directive, HostListener, inject, input } from '@angular/core'
import { takeUntil, tap } from 'rxjs'

@Directive({
  selector: '[appSecureUrl]',
  standalone: true,
})
export class SecureUrlDirective extends OnDestroyMixin(class {}) {
  secureDomain = input('blob.core.windows.net')
  private readonly adminService = inject(AdminService)
  private readonly doc = inject(DOCUMENT)

  @HostListener('click', ['$event'])
  onLinkOpened(event: Event) {
    const target = event.target as HTMLElement

    if (target.tagName === 'A') {
      event.preventDefault()

      const href = target.getAttribute('href')
      if (href && href.includes(this.secureDomain())) {
        this.adminService
          .secureUrl(href)
          .pipe(
            takeUntil(this.destroy$),
            tap(secureUrl => this.doc.defaultView?.open(secureUrl, '_blank'))
          )
          .subscribe()
      }
    }
  }
}
