import { ConfirmationDialogDataContact } from '@/contracts/confirmation-dialog-data-contract'
import { IgnoreSelectionDirective } from '@/directives/ignore-selection.directive'
import { LocalService } from '@/services/local.service'
import { Component, inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-confirmation-popup',
  standalone: true,
  imports: [IgnoreSelectionDirective],
  templateUrl: './confirmation-popup.component.html',
  styleUrl: './confirmation-popup.component.scss',
})
export class ConfirmationPopupComponent {
  ref = inject<MatDialogRef<ConfirmationPopupComponent>>(MatDialogRef)
  data = inject<ConfirmationDialogDataContact>(MAT_DIALOG_DATA)
  lang = inject(LocalService)
  onConfirm(): void {
    this.ref.close(true)
  }

  onCancel(): void {
    this.ref.close(false)
  }
}
