import { fadeInSlideUp } from '@/animations/fade-in-slide'
import { RecorderComponent } from '@/components/recorder/recorder.component'
import { DEFAULT_SEARCH_QUERY } from '@/constants/default-search-query'
import { SearchQueryContract } from '@/contracts/search-query-contract'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { AiSearchService } from '@/services/ai-search.service'
import { ChatHistoryService } from '@/services/chat-history.service'
import { LocalService } from '@/services/local.service'
import { PaginatorIntlService } from '@/services/paginator-intl.service'
import { AppStore } from '@/stores/app.store'
import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common'
import { Component, effect, inject, OnInit, signal, untracked, viewChild } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatTooltipModule } from '@angular/material/tooltip'
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs'

@Component({
  selector: 'app-ai-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatPaginatorModule,
    AsyncPipe,
    NgClass,
    MatProgressSpinnerModule,
    NgTemplateOutlet,
    RecorderComponent,
    MatTooltipModule,
  ],
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
export class AiSearchComponent extends OnDestroyMixin(class {}) implements OnInit {
  paginator = viewChild<MatPaginator>('paginator')
  aiSearchService = inject(AiSearchService)
  store = inject(AppStore)
  lang = inject(LocalService)
  chatHistoryService = inject(ChatHistoryService)
  botNames$ = this.chatHistoryService.getAllBotNames()
  searchForm = new FormControl('', { nonNullable: true })
  loadingSubject$ = new Subject<boolean>()
  search$ = new BehaviorSubject<string>('')
  paginate$ = new BehaviorSubject<Pick<SearchQueryContract, 'page_number' | 'page_size'>>({
    page_number: DEFAULT_SEARCH_QUERY.page_number,
    page_size: DEFAULT_SEARCH_QUERY.page_size,
  })
  total = signal<number>(0)
  searchToken = signal<string>('')
  botNameCtrl = new FormControl('website', { nonNullable: true })
  searchResults$ = this.load()
  isTruncatedContent = signal<boolean[]>([])
  readonly pageSizeOptions = [5, 10, 20, 30, 40, 50, 100]
  readonly pageSize = DEFAULT_SEARCH_QUERY.page_size
  animateTrigger = signal<boolean>(false)
  storeEffect = effect(() => {
    if (this.store.isRecordingStopped()) {
      untracked(() => {
        this.prepareForSearch(this.searchForm.value)
      })
    }
  })
  ngOnInit(): void {
    this.listenToSearch()
  }

  load() {
    const selectedBot = this.botNameCtrl.value
    return combineLatest([this.search$, this.paginate$]).pipe(
      filter(([search]) => search.trim().length > 0),
      tap(([searchToken]) => this.searchToken.set(searchToken)),
      switchMap(([search, paginate]) => {
        const searchQuery: SearchQueryContract = {
          ...DEFAULT_SEARCH_QUERY,
          page_number: paginate.page_number,
          page_size: paginate.page_size,
          query: search,
        }
        this.loadingSubject$.next(true)
        return this.aiSearchService
          .search(searchQuery, selectedBot)
          .pipe(finalize(() => this.loadingSubject$.next(false)))
      }),
      tap(({ total_count, rs }) => {
        this.total.set(total_count)
        this.isTruncatedContent.set(Array.from({ length: rs?.length ?? 0 }, () => true))
        this.animateTrigger.set(!this.animateTrigger())
      }),
      map(res => res.rs)
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
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        debounceTime(400),
        filter(searchToken => searchToken.trim().length > 0 && this.store.isRecordingStopped())
      )
      .subscribe(searchToken => {
        this.prepareForSearch(searchToken, false)
      })
  }
  resetPaginator() {
    if (this.paginator()) {
      this.paginator()!.pageIndex = 0
      this.paginator()!._changePageSize(this.paginator()!.pageSize)
    }
  }
  prepareForSearch(searchToken: string, resetAfterSearch = true) {
    this.resetPaginator()
    this.search$.next(searchToken)
    if (resetAfterSearch) this.searchForm.reset('', { emitEvent: false })
  }
}
