import { inject, Injectable } from '@angular/core'
import { MatPaginatorIntl } from '@angular/material/paginator'
import { Subject } from 'rxjs'
import { LocalService } from './local.service'

@Injectable({
  providedIn: 'root',
})
export class PaginatorIntlService implements MatPaginatorIntl {
  private readonly lang = inject(LocalService)

  changes: Subject<void> = new Subject<void>()
  itemsPerPageLabel = this.lang.locals.items_per_page_label
  nextPageLabel = this.lang.locals.next_page_label
  previousPageLabel = this.lang.locals.previous_page_label
  firstPageLabel = this.lang.locals.first_page_label
  lastPageLabel = this.lang.locals.last_page_label

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `${this.lang.locals.page} 1 ${this.lang.locals.of} 1`
    }
    const amountPages = Math.ceil(length / pageSize)
    return `${this.lang.locals.page} ${page + 1} ${this.lang.locals.of} ${amountPages}`
  }
}
