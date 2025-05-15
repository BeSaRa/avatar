import { FAQService } from '@/services/faq.service'
import { LocalService } from '@/services/local.service'
import { Component, inject, OnInit, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { CheckboxComponent } from '../checkbox/checkbox.component'
import { ArchiveFAQContract } from '@/contracts/FAQ-contract'
import { debounceTime, distinctUntilChanged, finalize, of, switchMap, takeUntil, tap } from 'rxjs'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { DropdownComponent } from '../dropdown/dropdown.component'
import { ChatHistoryService } from '@/services/chat-history.service'
import { TemplateDirective } from '@/directives/template.directive'
import { AddFaqPopupComponent } from '../add-faq-popup/add-faq-popup.component'
import { MatDialog } from '@angular/material/dialog'
import { slideFromBottom } from '@/animations/fade-in-slide'
import { ConfirmationDialogDataContact } from '@/contracts/confirmation-dialog-data-contract'
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component'
import { NgClass } from '@angular/common'
import { EditFaqPopupComponent } from '../edit-faq-popup/edit-faq-popup.component'
import { HasPermissionDirective } from '@/directives/has-permission.directive'

@Component({
  selector: 'app-faq-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckboxComponent,
    DropdownComponent,
    TemplateDirective,
    NgClass,
    HasPermissionDirective,
  ],
  templateUrl: './faq-list.component.html',
  styleUrl: './faq-list.component.scss',
  animations: [slideFromBottom],
})
export class FaqListComponent extends OnDestroyMixin(class {}) implements OnInit {
  lang = inject(LocalService)
  faqService = inject(FAQService)
  chatHistoryService = inject(ChatHistoryService)
  dialog = inject(MatDialog)
  searchControl = new FormControl('', { nonNullable: true })
  selectedFAQ: ArchiveFAQContract[] = []
  allArchivedFAQs = signal<ArchiveFAQContract[]>([])
  filteredArchivedFAQs = signal<ArchiveFAQContract[]>([])
  selectedBotName = new FormControl('', { nonNullable: true })
  selectedRawKey = new Set<string>()
  botNames = signal<string[]>([])
  isLoading = signal<boolean>(false)

  ngOnInit(): void {
    this.prepareDate()
    this.listenToSearch()
    this.listenToBotNameChange()
  }
  toggleSelection(isChecked: boolean, faq: ArchiveFAQContract) {
    if (isChecked) {
      this.selectedFAQ.push(faq)
      this.selectedRawKey.add(faq.RowKey)
    } else {
      this.deleteFromSelected(faq)
    }
  }

  private deleteFromSelected(faq: ArchiveFAQContract) {
    const index = this.selectedFAQ.findIndex(el => el.RowKey === faq.RowKey)
    if (index > -1) {
      this.selectedFAQ.splice(index, 1)
      this.selectedRawKey.delete(faq.RowKey)
    }
  }
  isAllSelected(): boolean {
    return this.filteredArchivedFAQs().length > 0 && this.selectedFAQ.length === this.filteredArchivedFAQs().length
  }

  toggleSelectAll(isChecked: boolean) {
    if (isChecked) {
      this.filteredArchivedFAQs().forEach(faq => {
        this.selectedFAQ.push(faq)
        this.selectedRawKey.add(faq.RowKey)
      })
    } else {
      this.selectedFAQ = []
      this.selectedRawKey.clear()
    }
  }

  prepareDate() {
    this.chatHistoryService
      .getAllBotNames()
      .pipe(
        tap(bots => this.selectedBotName.patchValue(bots.at(0)!)),
        tap(bots => this.botNames.set(bots))
      )
      .subscribe()
  }
  getArchivedFAQs() {
    this.isLoading.set(true)
    return this.faqService.getArchivedFAQs(this.selectedBotName.getRawValue()).pipe(
      takeUntil(this.destroy$),
      tap(data => {
        this.allArchivedFAQs.set(data)
        this.filteredArchivedFAQs.set(data)
      }),
      finalize(() => this.isLoading.set(false))
    )
  }
  listenToSearch(): void {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(500), distinctUntilChanged())
      .subscribe(searchTerm => {
        this.filteredArchivedFAQs.update(() =>
          this.allArchivedFAQs().filter(faq => faq.ActualQuestion.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      })
  }

  listenToBotNameChange(): void {
    this.selectedBotName.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.getArchivedFAQs())
      )
      .subscribe()
  }

  addArchivedFAQs() {
    this.dialog
      .open<AddFaqPopupComponent, string, boolean>(AddFaqPopupComponent, {
        data: this.selectedBotName.getRawValue(),
      })
      .afterClosed()
      .pipe(switchMap(isAdded => (isAdded ? this.getArchivedFAQs() : of(null))))
      .subscribe()
  }
  updateArchivedFAQs(faq: ArchiveFAQContract) {
    this.dialog
      .open<EditFaqPopupComponent, { selectedQuestion: ArchiveFAQContract; allFAQ: ArchiveFAQContract[] }, boolean>(
        EditFaqPopupComponent,
        {
          data: { allFAQ: this.allArchivedFAQs(), selectedQuestion: faq },
        }
      )
      .afterClosed()
      .pipe(switchMap(isEdited => (isEdited ? this.getArchivedFAQs() : of(null))))
      .subscribe()
  }
  generateSelectedItemsHTML(items?: ArchiveFAQContract[]) {
    const listItems = (items ?? this.selectedFAQ)
      .map(item => `<li class="text-xs text-primary bg-gray-200 p-2 rounded-lg">${item.ActualQuestion}</li>`)
      .join('')
    return `<p class="text-sm text-gray-700 font-medium mb-2">${this.lang.locals.delete_message}</p>
            <ul class="flex flex-col p-4 overflow-auto max-h-80 space-y-2">${listItems}</ul>`
  }
  deleteSelectedFAQs(items?: ArchiveFAQContract[]) {
    this.dialog
      .open<ConfirmationPopupComponent, ConfirmationDialogDataContact, boolean>(ConfirmationPopupComponent, {
        data: {
          htmlContent: this.generateSelectedItemsHTML(items),
        },
      })
      .afterClosed()
      .pipe(
        switchMap(isConfirmed => {
          if (!isConfirmed) return of(null)

          return this.faqService.deleteFAQBulk(this.selectedBotName.getRawValue(), items ?? this.selectedFAQ).pipe(
            takeUntil(this.destroy$),
            switchMap(() => this.getArchivedFAQs()),
            tap(() => {
              if (!items) {
                this.selectedFAQ = []
                this.selectedRawKey.clear()
              } else {
                items.forEach(item => {
                  const index = this.selectedFAQ.findIndex(el => el.RowKey === item.RowKey)
                  if (this.selectedRawKey.has(item.RowKey)) {
                    this.selectedRawKey.delete(item.RowKey)
                  }
                  if (index > -1) {
                    this.selectedFAQ.splice(index, 1)
                  }
                })
              }
            })
          )
        })
      )
      .subscribe()
  }
}
