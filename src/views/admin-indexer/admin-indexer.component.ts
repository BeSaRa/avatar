import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core'
import { catchError, finalize, of, debounceTime, distinctUntilChanged, tap, takeUntil } from 'rxjs'
import { AdminService } from '@/services/admin.service'
import { IndexerInfoContract } from '@/contracts/indexer-info-contract'
import { LocalService } from '@/services/local.service'
import { expandCollapse } from '@/animations/expand-collapse'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'

@Component({
  selector: 'app-admin-indexer',
  standalone: true,
  imports: [ReactiveFormsModule, PerfectScrollDirective],
  templateUrl: './admin-indexer.component.html',
  styleUrls: ['./admin-indexer.component.scss'],
  animations: [expandCollapse],
})
export class AdminIndexerComponent extends OnDestroyMixin(class {}) implements OnInit {
  indexers: string[] = []
  filteredIndexers: string[] = []
  searchControl = new FormControl('', { nonNullable: true })
  declare selectedIndexerInfo: IndexerInfoContract
  loading = false
  errorMessage = ''
  expandedIndex: string | null = null
  loadingIndex: string | null = null
  runningIndex: string | null = null
  infoErrorMessage: string | null = null
  adminService = inject(AdminService)
  lang = inject(LocalService)
  @ViewChild('indexInfo', { static: false }) indexInfo!: ElementRef<HTMLDivElement>

  ngOnInit(): void {
    this.fetchIndexers()
    this.listenToSearch()
  }

  fetchIndexers(): void {
    this.loading = true
    this.errorMessage = ''
    this.adminService
      .getIndexes()
      .pipe(
        takeUntil(this.destroy$),
        tap(data => {
          this.indexers = data
          this.filteredIndexers = data
        }),
        catchError(() => {
          this.errorMessage = 'Failed to fetch indexers.'
          return of([])
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe()
  }

  resetAndRunIndexer(indexerName: string): void {
    this.runningIndex = indexerName
    this.errorMessage = ''
    this.adminService
      .runIndexer(indexerName)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.errorMessage = `Failed to run indexer: ${indexerName}`
          return of(null)
        }),
        finalize(() => (this.runningIndex = null))
      )
      .subscribe(() => {
        if (!this.errorMessage) alert(`${indexerName} run successfully.`)
      })
  }

  toggleExpand(indexerName: string): void {
    if (this.expandedIndex === indexerName) {
      this.expandedIndex = null
      this.selectedIndexerInfo = {} as IndexerInfoContract // Clear details
      this.infoErrorMessage = null // Clear error message
    } else {
      this.fetchIndexerInfo(indexerName)
    }
  }

  fetchIndexerInfo(indexerName: string): void {
    this.expandedIndex = null
    this.loadingIndex = indexerName
    this.infoErrorMessage = null
    this.errorMessage = ''
    this.adminService
      .getIndexInfo(indexerName)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.infoErrorMessage = `${this.lang.locals.indexer_warning} ${indexerName}.`
          this.expandedIndex = indexerName // Expand row to show the error
          return of(null)
        }),
        finalize(() => (this.loadingIndex = null))
      )
      .subscribe(info => {
        if (info) {
          this.selectedIndexerInfo = info
          this.expandedIndex = indexerName
          setTimeout(() => {
            if (this.indexInfo) {
              this.indexInfo.nativeElement.scrollIntoView({ behavior: 'smooth' })
            }
          }, 100)
        }
      })
  }

  listenToSearch(): void {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(500), distinctUntilChanged())
      .subscribe(searchTerm => {
        this.filteredIndexers = this.indexers.filter(indexer =>
          indexer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
  }
}
