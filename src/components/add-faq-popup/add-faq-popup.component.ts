import { FAQContract } from '@/contracts/FAQ-contract'
import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { FAQService } from '@/services/faq.service'
import { LocalService } from '@/services/local.service'
import { Component, inject, OnInit, signal } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { finalize, takeUntil, tap } from 'rxjs'
import { CheckboxComponent } from '../checkbox/checkbox.component'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { NgTemplateOutlet } from '@angular/common'
@Component({
  selector: 'app-add-faq-popup',
  standalone: true,
  imports: [MatDialogModule, PerfectScrollDirective, CheckboxComponent, ReactiveFormsModule, NgTemplateOutlet],
  templateUrl: './add-faq-popup.component.html',
  styleUrl: './add-faq-popup.component.scss',
})
export class AddFaqPopupComponent extends OnDestroyMixin(class {}) implements OnInit {
  lang = inject(LocalService)
  faqService = inject(FAQService)
  ref = inject<MatDialogRef<AddFaqPopupComponent>>(MatDialogRef)
  botName = inject<string>(MAT_DIALOG_DATA)
  toArchivedFAQs: FAQContract[] = []
  allFAQs = signal<FAQContract[]>([])
  isLoading = signal<boolean>(false)
  isLoadingArhive = signal<boolean>(false)
  checkAllForm = new FormControl(false, { nonNullable: true })
  selectedRawKey = new Set<string>()

  ngOnInit(): void {
    this.getUnArchivedFAQs()
  }

  getUnArchivedFAQs() {
    this.isLoading.set(true)
    this.faqService
      .getUnArchivedFAQs(this.botName)
      .pipe(
        takeUntil(this.destroy$),
        tap(data => this.allFAQs.set(data)),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe()
  }

  onQuestionSelect(checked: boolean, faq: FAQContract) {
    if (checked) {
      this.toArchivedFAQs.push(faq)
      this.selectedRawKey.add(faq.RowKey)
      if (this.toArchivedFAQs.length === this.allFAQs().length) {
        this.checkAllForm.patchValue(true)
      }
    } else {
      this.deleteFromArchived(faq)
    }
  }

  deleteFromArchived(faq: FAQContract) {
    const index = this.toArchivedFAQs.findIndex(el => el.RowKey === faq.RowKey)
    if (index > -1) {
      this.toArchivedFAQs.splice(index, 1)
      this.selectedRawKey.delete(faq.RowKey)
      this.checkAllForm.patchValue(false)
    }
  }

  addToArchive() {
    this.isLoadingArhive.set(true)
    this.faqService
      .addToArchivedFAQs(this.botName, this.toArchivedFAQs)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoadingArhive.set(false)
          this.ref.close(true)
        })
      )
      .subscribe()
  }
  toggleSelectAll(isChecked: boolean) {
    this.resetLists()
    if (isChecked) {
      this.allFAQs().forEach(item => {
        this.toArchivedFAQs.push(item)
        this.selectedRawKey.add(item.RowKey)
      })
    }
  }
  resetLists() {
    this.toArchivedFAQs = []
    this.selectedRawKey.clear()
  }
}
