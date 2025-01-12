import { contentAnimation } from '@/animations/content-appear'
import { slideFromBottom } from '@/animations/fade-in-slide'
import { ConfirmationPopupComponent } from '@/components/confirmation-popup/confirmation-popup.component'
// eslint-disable-next-line max-len
import { UploadStorageFilePopupComponent } from '@/components/upload-storage-file-popup/upload-storage-file-popup.component'
import { ConfirmationDialogDataContact } from '@/contracts/confirmation-dialog-data-contract'
import { IgnoreSelectionDirective } from '@/directives/ignore-selection.directive'
import { SelectableContainerDirective } from '@/directives/selectable-container.directive'
import { SelectableItemDirective } from '@/directives/selectable-item.directive'
import { AdminService } from '@/services/admin.service'
import { LocalService } from '@/services/local.service'
import { AsyncPipe, NgClass, NgOptimizedImage, NgStyle } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTooltipModule } from '@angular/material/tooltip'
import { ActivatedRoute, Router } from '@angular/router'
import { catchError, distinctUntilChanged, filter, finalize, map, of, switchMap, tap } from 'rxjs'

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
  ],
  animations: [slideFromBottom, contentAnimation],
  templateUrl: './admin-storage.component.html',
  styleUrl: './admin-storage.component.scss',
})
export class AdminStorageComponent {
  lang = inject(LocalService)
  adminService = inject(AdminService)
  router = inject(Router)
  route = inject(ActivatedRoute)
  isContainerLoading = signal(true)
  containers$ = this.adminService.getContainers().pipe(finalize(() => this.isContainerLoading.set(false)))
  breadcrumbs = signal<string[]>([])
  isSubfolder = signal<boolean | undefined>(undefined)
  content = signal<string[]>([])
  skeltonList = Array.from({ length: 10 }, (_, k) => k).fill(0)
  skeletonWidths = Array.from({ length: 20 }, () => Math.floor(Math.random() * 50) + 50)

  loading = signal(false)
  dialog = inject(MatDialog)
  selectedItems = new Set<string>() // Track selected items

  /**
   *
   */
  constructor() {
    this.listenToQueryParams()
  }
  listenToQueryParams() {
    this.containers$
      .pipe(
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
        if (containerName) {
          this.updateBreadcrumbs(containerName, folderName)

          if (folderName) {
            this.openFolder(containerName, folderName)
          } else {
            this.openContainer(containerName)
          }
        } else {
          this.resetState()
        }
      })
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
    this.adminService.getSubfolder(containerName).subscribe(folders => {
      this.content.set(folders)
      this.isSubfolder.set(true) // Indicate that it's a subfolder
      this.loading.set(false)
    })
  }

  openFolder(containerName: string, folderName: string) {
    this.loading.set(true)
    this.adminService.getBlobs(containerName, folderName).subscribe(blobs => {
      this.content.set(blobs)
      this.isSubfolder.set(false) // Indicate that it's files, not subfolders
      this.loading.set(false)
    })
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
    const newBreadcrumbs = folderName ? [containerName, folderName] : [containerName]
    this.breadcrumbs.set(newBreadcrumbs)
  }

  resetState() {
    this.breadcrumbs.set([])
    this.content.set([])
    this.isSubfolder.set(undefined)
  }

  openFileUploadDialog() {
    this.dialog.open(UploadStorageFilePopupComponent, {
      data: {
        container_name: this.route.snapshot.queryParamMap.get('containerName'),
        subfolder_name: this.route.snapshot.queryParamMap.get('folderName'),
      },
    })
  }

  onSelectionChange(selected: Set<string>): void {
    console.log(selected)
    this.selectedItems = selected
  }
  deleteFolder(folderName: string) {
    this.dialog
      .open<ConfirmationPopupComponent, ConfirmationDialogDataContact, boolean>(ConfirmationPopupComponent, {
        data: {
          // eslint-disable-next-line max-len
          htmlContent: `<p class="text-center text-xl text-gray-700">${this.lang.locals.delete_message} ? <span class="italic text-base">${folderName}<span> ? </p>`,
          confirmButtonText: this.lang.locals.delete,
          confirmButtonClasses: '!bg-red-500 hover:!bg-red-600',
        },
      })
      .afterClosed()
      .pipe(
        switchMap(res => {
          if (!res) {
            return of(null) // Exit if the dialog is canceled
          }

          const [containerName] = this.breadcrumbs()

          // Call delete API and chain the openFolder API
          return this.adminService
            .deleteSubfolder(containerName, folderName)
            .pipe(switchMap(() => of(this.openContainer(containerName))))
        }),
        catchError(err => {
          console.error('An error occurred:', err)
          return of(null) // Continue gracefully even if there's an error
        })
      )
      .subscribe() // No next or error handling in the subscribe block
  }
  onDelete(event: MouseEvent): void {
    event.stopPropagation() // Prevent the click from propagating to the container

    this.dialog
      .open<ConfirmationPopupComponent, ConfirmationDialogDataContact, boolean>(ConfirmationPopupComponent, {
        data: {
          htmlContent: this.generateSelectedItemsHtml(Array.from(this.selectedItems)),
          confirmButtonText: this.lang.locals.delete,
          confirmButtonClasses: '!bg-red-500 hover:!bg-red-600',
        },
      })
      .afterClosed()
      .pipe(
        switchMap(res => {
          if (!res) {
            return of(null) // Exit if the dialog is canceled
          }

          const [containerName, subFolderName] = this.breadcrumbs()
          const fileNames = Array.from(this.selectedItems)

          // Call delete API and chain the openFolder API
          return this.adminService.deleteByListOfTitles(containerName, subFolderName, fileNames).pipe(
            switchMap(() => of(this.openFolder(containerName, subFolderName))),
            tap(() => this.selectedItems.clear())
          )
        }),
        catchError(err => {
          console.error('An error occurred:', err)
          return of(null) // Continue gracefully even if there's an error
        })
      )
      .subscribe() // No next or error handling in the subscribe block
  }

  generateSelectedItemsHtml(selectedItems: string[]): string {
    const getItemIcon = (item: string): string => {
      const extension = item.split('.').pop()?.toLowerCase()
      if (extension === 'pdf') {
        return 'assets/images/pdf-file.svg'
      } else if (extension === 'json') {
        return 'assets/images/json-file.svg'
      }
      return 'assets/images/default-file.svg' // Fallback for unknown types
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
}
