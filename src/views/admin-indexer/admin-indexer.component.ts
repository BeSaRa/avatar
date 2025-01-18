import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core'
import { catchError, finalize, switchMap, of, debounceTime, distinctUntilChanged, tap } from 'rxjs'
import { AdminService } from '@/services/admin.service'
import { IndexerInfoContract } from '@/contracts/indexer-info-contract'
import { LocalService } from '@/services/local.service'
import { expandCollapse } from '@/animations/expand-collapse'
import { FormControl, ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-admin-indexer',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-indexer.component.html',
  styleUrls: ['./admin-indexer.component.scss'],
  animations: [expandCollapse],
})
export class AdminIndexerComponent implements OnInit {
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
      .resetIndex(indexerName)
      .pipe(
        switchMap(() => this.adminService.runIndexer(indexerName)),
        catchError(() => {
          this.errorMessage = `Failed to reset and run indexer: ${indexerName}`
          return of(null)
        }),
        finalize(() => (this.runningIndex = null))
      )
      .subscribe(() => {
        if (!this.errorMessage) alert(`${indexerName} reset and run successfully.`)
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
    this.searchControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchTerm => {
      this.filteredIndexers = this.indexers.filter(indexer => indexer.toLowerCase().includes(searchTerm.toLowerCase()))
    })
  }
}
