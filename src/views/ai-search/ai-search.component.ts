import { fadeInSlideUp } from '@/animations/fade-in-slide'
import { DEFAULT_SEARCH_QUERY } from '@/constants/default-search-query'
import { SearchQueryContract } from '@/contracts/search-query-contract'
import { AiSearchService } from '@/services/ai-search.service'
import { LocalService } from '@/services/local.service'
import { PaginatorIntlService } from '@/services/paginator-intl.service'
import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs'

@Component({
  selector: 'app-ai-search',
  standalone: true,
  imports: [ReactiveFormsModule, MatPaginatorModule, AsyncPipe, NgClass, MatProgressSpinnerModule, NgTemplateOutlet],
  templateUrl: './ai-search.component.html',
  styleUrl: './ai-search.component.scss',
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: PaginatorIntlService,
    },
  ],
  animations: [fadeInSlideUp],
})
export class AiSearchComponent implements OnInit {
  aiSearchService = inject(AiSearchService)
  lang = inject(LocalService)
  searchForm = new FormControl('', { nonNullable: true })
  loadingSubject$ = new Subject<boolean>()
  search$ = new BehaviorSubject<string>('')
  paginate$ = new BehaviorSubject<Pick<SearchQueryContract, 'page_number' | 'page_size'>>({
    page_number: DEFAULT_SEARCH_QUERY.page_number,
    page_size: DEFAULT_SEARCH_QUERY.page_size,
  })
  total = signal<number>(0)
  searchToken = signal<string>('')
  searchResults$ = this.load()
  isTruncatedContent = signal<boolean[]>([])
  readonly pageSizeOptions = [5, 10, 20, 30, 40, 50, 100]
  readonly pageSize = DEFAULT_SEARCH_QUERY.page_size
  animateTrigger = signal<boolean>(false)

  ngOnInit(): void {
    this.listenToSearch()
  }

  load() {
    return of(undefined).pipe(
      switchMap(() => {
        return combineLatest([this.search$, this.paginate$]).pipe(
          filter(([search]) => search.trim().length > 0),
          switchMap(([search, paginate]) => {
            const searchQuery: SearchQueryContract = {
              ...DEFAULT_SEARCH_QUERY,
              page_number: paginate.page_number,
              page_size: paginate.page_size,
              query: search,
            }
            this.loadingSubject$.next(true)
            return this.aiSearchService.search(searchQuery).pipe(finalize(() => this.loadingSubject$.next(false)))
          }),
          tap(({ total_count, rs }) => {
            this.total.set(total_count)
            this.isTruncatedContent.set(Array.from({ length: rs?.length ?? 0 }, () => true))
            this.searchForm.reset('', { emitEvent: false })
            this.animateTrigger.set(!this.animateTrigger())
          }),
          map(res => res.rs)
        )
      })
    )
  }

  onPaginate(event: PageEvent) {
    this.paginate$.next({
      page_number: event.pageIndex + 1,
      page_size: event.pageSize,
    })
  }

  listenToSearch() {
    this.searchForm.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(250),
        filter(searchToken => searchToken.trim().length > 0)
      )
      .subscribe(searchToken => {
        this.searchToken.set(searchToken)
        this.search$.next(searchToken)
      })
  }
}
