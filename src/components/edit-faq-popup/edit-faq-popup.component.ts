import { ArchiveFAQContract, createFAQForm, FAQForm } from '@/contracts/FAQ-contract'
import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { FAQService } from '@/services/faq.service'
import { LocalService } from '@/services/local.service'
import { NgClass, NgTemplateOutlet } from '@angular/common'
import { Component, inject, Injector, OnInit, runInInjectionContext, signal } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { finalize, forkJoin, of, switchMap, takeUntil } from 'rxjs'

@Component({
  selector: 'app-edit-faq-popup',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule, NgTemplateOutlet, NgClass, PerfectScrollDirective],
  templateUrl: './edit-faq-popup.component.html',
  styleUrl: './edit-faq-popup.component.scss',
})
export class EditFaqPopupComponent extends OnDestroyMixin(class {}) implements OnInit {
  lang = inject(LocalService)
  faqService = inject(FAQService)
  ref = inject<MatDialogRef<EditFaqPopupComponent>>(MatDialogRef)
  fb = inject(NonNullableFormBuilder)
  injctor = inject(Injector)
  faqData = inject<{ selectedQuestion: ArchiveFAQContract; allFAQ: ArchiveFAQContract[] }>(MAT_DIALOG_DATA)
  declare faqFrom: FAQForm
  isLoading = signal<boolean>(false)

  ngOnInit(): void {
    this.prepareForm()
  }

  prepareForm() {
    runInInjectionContext(this.injctor, () => {
      this.faqFrom = createFAQForm(this.faqData.selectedQuestion)
    })
  }

  editFAQ() {
    this.isLoading.set(true)
    const { RowKey, OrderIndex } = this.faqFrom.value
    const { OrderIndex: previousIndex } = this.faqData.selectedQuestion
    const duplicatedFAQPerOrderIndex = this.faqData.allFAQ.find(
      el => el.OrderIndex === OrderIndex! && el.RowKey !== RowKey
    )
    const updateItem = (rowKey: string, faq: Partial<ArchiveFAQContract>) =>
      this.faqService.updateArchivedFAQs(rowKey, faq).pipe(takeUntil(this.destroy$))

    of(duplicatedFAQPerOrderIndex)
      .pipe(
        switchMap(existingItem => {
          if (existingItem) {
            return forkJoin([
              updateItem(RowKey!, this.faqFrom.value),
              updateItem(existingItem.RowKey, { OrderIndex: previousIndex }),
            ])
          } else {
            return updateItem(RowKey!, this.faqFrom.value)
          }
        }),
        finalize(() => {
          this.isLoading.set(false)
          this.ref.close(true)
        })
      )
      .subscribe()
  }
}
