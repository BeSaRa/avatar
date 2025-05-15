import { contentAnimation } from '@/animations/content-appear'
import { slideFromBottom } from '@/animations/fade-in-slide'
import { ConfirmationPopupComponent } from '@/components/confirmation-popup/confirmation-popup.component'
// eslint-disable-next-line max-len
import { UploadStorageFilePopupComponent } from '@/components/upload-storage-file-popup/upload-storage-file-popup.component'
import { ConfirmationDialogDataContact } from '@/contracts/confirmation-dialog-data-contract'
import { HasPermissionDirective } from '@/directives/has-permission.directive'
import { IgnoreSelectionDirective } from '@/directives/ignore-selection.directive'
import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { SelectableContainerDirective } from '@/directives/selectable-container.directive'
import { SelectableItemDirective } from '@/directives/selectable-item.directive'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { AdminService } from '@/services/admin.service'
import { LocalService } from '@/services/local.service'
import { AsyncPipe, DOCUMENT, NgClass, NgOptimizedImage, NgStyle, NgTemplateOutlet } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTooltipModule } from '@angular/material/tooltip'
import { ActivatedRoute, Router } from '@angular/router'
import { catchError, distinctUntilChanged, filter, finalize, iif, map, of, switchMap, takeUntil, tap } from 'rxjs'

@Component({
  selector: 'app-admin-storage',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    NgOptimizedImage,
    NgStyle,
    SelectableContainerDirective,
    SelectableItemDirective,
    IgnoreSelectionDirective,
    MatTooltipModule,
    PerfectScrollDirective,
    NgTemplateOutlet,
    HasPermissionDirective,
  ],
  animations: [slideFromBottom, contentAnimation],
  templateUrl: './admin-storage.component.html',
  styleUrl: './admin-storage.component.scss',
})
export class AdminStorageComponent extends OnDestroyMixin(class {}) {
  lang = inject(LocalService)
  private readonly adminService = inject(AdminService)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly dialog = inject(MatDialog)
  private readonly document = inject(DOCUMENT)

  isContainerLoading = signal(true)
  loading = signal(false)
  isLoadingIndexer = signal(false)
  legalContainers$ = this.adminService
    .getContainers()
    .pipe(map(containers => containers.filter(container => container === 'rera-legal')))
  containersExceptLegals$ = this.adminService
    .getContainers()
    .pipe(map(containers => containers.filter(container => !container.includes('legal'))))
  isReraLegal = signal(this.router.url.split('/').at(-1)!.includes('rera-legal-storage'))
  containers$ = iif(() => this.isReraLegal(), this.legalContainers$, this.containersExceptLegals$).pipe(
    takeUntil(this.destroy$),
    finalize(() => this.isContainerLoading.set(false))
  )

  breadcrumbs = signal<string[]>([])
  isSubfolder = signal<boolean | undefined>(undefined)
  content = signal<string[]>([])

  //skeleton UI
  skeletonList = Array.from({ length: 10 }, (_, k) => k).fill(0)
  skeletonWidths = Array.from({ length: 20 }, () => Math.floor(Math.random() * 50) + 50)

  selectedItems = new Set<string>() // Track selected items

  constructor() {
    super()
    this.listenToQueryParams()
  }

  listenToQueryParams() {
    this.containers$
      .pipe(
        takeUntil(this.destroy$),
        // Combine the containers list with query params
        switchMap((containers: string[]) =>
          this.route.queryParams.pipe(
            map(params => ({
              containerName: params['containerName'],
              folderName: params['folderName'],
              containers,
            }))
          )
        ),
        // Filter out invalid container names
        filter(({ containerName, containers }) => (containerName ? containers.includes(containerName) : true)),
        // Ignore updates where containerName and folderName haven't changed
        distinctUntilChanged(
          (prev, curr) => prev.containerName === curr.containerName && prev.folderName === curr.folderName
        )
      )
      .subscribe(({ containerName, folderName }) => {
        this.handleNavigation(containerName, folderName)
      })
  }

  handleNavigation(containerName?: string, folderName?: string) {
    if (containerName) {
      this.updateBreadcrumbs(containerName, folderName)
      folderName ? this.openFolder(containerName, folderName) : this.openContainer(containerName)
    } else {
      this.resetState()
    }
  }
  updateQueryParams(containerName?: string, folderName?: string) {
    const queryParams: Record<string, string | null> = {}

    if (containerName) {
      queryParams['containerName'] = containerName // Set containerName
    }

    // Only include folderName if provided; otherwise, remove it
    queryParams['folderName'] = folderName || null

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge', // Merge query params
    })
  }

  openContainer(containerName: string) {
    this.loading.set(true)
    this.adminService
      .getSubfolder(containerName)
      .pipe(
        takeUntil(this.destroy$),
        tap(folders => {
          this.content.set(folders)
          this.isSubfolder.set(true)
        }),
        catchError(error => {
          console.error('Error loading container:', error)
          return of([])
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe()
  }

  openFolder(containerName: string, folderName: string) {
    this.loading.set(true)
    this.adminService
      .getBlobs(containerName, folderName)
      .pipe(
        takeUntil(this.destroy$),
        tap(blobs => {
          this.content.set(blobs)
          this.isSubfolder.set(false)
        }),
        catchError(error => {
          console.error('Error loading folder:', error)
          return of([])
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe()
  }

  navigateBreadcrumb(index: number) {
    if (index === this.breadcrumbs().length - 1) return
    const updatedBreadcrumbs = this.breadcrumbs().slice(0, index + 1) // Slice breadcrumbs up to clicked index
    this.breadcrumbs.set(updatedBreadcrumbs)

    if (updatedBreadcrumbs.length === 1) {
      const containerName = updatedBreadcrumbs[0]
      this.updateQueryParams(containerName)
    } else {
      const containerName = updatedBreadcrumbs[0]
      const folderName = updatedBreadcrumbs[updatedBreadcrumbs.length - 1]
      this.updateQueryParams(containerName, folderName)
    }
  }

  updateBreadcrumbs(containerName: string, folderName?: string) {
    this.breadcrumbs.set(folderName ? [containerName, folderName] : [containerName])
  }

  resetState() {
    this.breadcrumbs.set([])
    this.content.set([])
    this.isSubfolder.set(undefined)
  }

  openFileUploadDialog() {
    const [containerName, folderName] = this.breadcrumbs()
    this.dialog.open(UploadStorageFilePopupComponent, {
      data: {
        container_name: containerName,
        subfolder_name: folderName,
      },
    })
  }

  onSelectionChange(selected: Set<string>): void {
    this.selectedItems = selected
  }
  deleteFolder(folderName: string) {
    const containerName = this.breadcrumbs()[0]
    if (!containerName) return

    this.dialog
      .open<ConfirmationPopupComponent, ConfirmationDialogDataContact, boolean>(ConfirmationPopupComponent, {
        data: {
          // eslint-disable-next-line max-len
          htmlContent: `<p class="flex flex-col gap-4 text-center text-xl text-gray-700">${this.lang.locals.delete_message} <span class="italic text-sm text-primary">${folderName}<span> ? </p>`,
        },
      })
      .afterClosed()
      .pipe(
        switchMap(confirmed => {
          if (!confirmed) return of(null)
          return this.adminService.deleteSubfolder(containerName, folderName).pipe(
            takeUntil(this.destroy$),
            tap(() => this.openContainer(containerName)),
            catchError(error => {
              console.error('Error deleting folder:', error)
              return of(null)
            })
          )
        })
      )
      .subscribe()
  }
  deleteFiles(): void {
    const [containerName, subFolderName] = this.breadcrumbs()
    const fileNames = Array.from(this.selectedItems)
    if (!fileNames.length) return

    this.dialog
      .open<ConfirmationPopupComponent, ConfirmationDialogDataContact, boolean>(ConfirmationPopupComponent, {
        data: {
          htmlContent: this.generateSelectedItemsHtml(Array.from(this.selectedItems)),
        },
      })
      .afterClosed()
      .pipe(
        switchMap(confirmed => {
          if (!confirmed) return of(null)
          // Call delete API and chain the openFolder API
          return this.adminService.deleteByListOfTitles(containerName, subFolderName, fileNames).pipe(
            takeUntil(this.destroy$),
            tap(() => this.openFolder(containerName, subFolderName)),
            tap(() => this.selectedItems.clear()),
            catchError(err => {
              console.error('An error occurred:', err)
              return of(null) // Continue gracefully even if there's an error
            })
          )
        })
      )
      .subscribe()
  }

  generateSelectedItemsHtml(selectedItems: string[]): string {
    const getItemIcon = (item: string): string => {
      const extension = item.split('.').pop()?.toLowerCase()
      if (extension === 'pdf') {
        return 'assets/images/pdf-file.svg'
      } else if (extension === 'json') {
        return 'assets/images/json-file.svg'
      }
      return 'assets/images/json-file.svg'
    }

    const listItemsHtml = selectedItems
      .map(
        item => `
         <li
          class="flex items-center border-b border-gray-200 truncate hover:bg-gray-100 transition-all duration-200 p-4">
            <img src="${getItemIcon(item)}" alt="item icon" class="w-8 h-8 object-contain" />
            <span title="${item}" class="truncate text-xs text-gray-800 w-full">${item}</span>
          </li>
        `
      )
      .join('')

    return `
      <div
        class="w-full max-w-lg mx-auto bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
        <div class="p-4 bg-gray-100 border-b border-gray-300">
          <p class="text-sm text-gray-700 font-medium">${this.lang.locals.delete_message}?</p>
        </div>
        <ul class="flex flex-col p-4 overflow-auto max-h-80">
          ${listItemsHtml}
        </ul>
      </div>
    `
  }

  runIndexer(indexerName = 'rera-legal'): void {
    this.isLoadingIndexer.set(true)
    let errorMessage = ''
    this.adminService
      .runIndexer(indexerName)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          errorMessage = `Failed to run indexer: ${indexerName}`
          return of(null)
        }),
        finalize(() => this.isLoadingIndexer.set(false))
      )
      .subscribe(() => {
        if (!errorMessage) alert(`${indexerName} run successfully.`)
      })
  }
  downloadBlob(event: MouseEvent, containerName: string, blobName: string) {
    event.stopPropagation()
    this.adminService
      .downloadBlob(containerName, blobName)
      .pipe(
        tap(fileData => {
          const { data: fileUrl } = fileData
          const link = this.document.createElement('a')
          link.href = fileUrl ?? ''
          link.download = blobName
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      )
      .subscribe(res => {
        console.log(res)
      })
  }
}
