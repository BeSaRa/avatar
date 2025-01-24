import { AdminService } from '@/services/admin.service'
import { LocalService } from '@/services/local.service'
import { Component, inject, signal } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MatTabsModule } from '@angular/material/tabs'
import { KeyvaluePairFormComponent } from '../keyvalue-pair-form/keyvalue-pair-form.component'
import { SettingsFormComponent } from '../settings-form/settings-form.component'
import { MatExpansionModule } from '@angular/material/expansion'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { createUrlGroup, UrlGroup } from '@/types/url-crawler'
import { NgClass } from '@angular/common'
import { markAllControlsAsTouchedAndDirty } from '@/utils/utils'

@Component({
  selector: 'app-add-url-popup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTabsModule,
    KeyvaluePairFormComponent,
    SettingsFormComponent,
    MatExpansionModule,
    MatDialogModule,
    PerfectScrollDirective,
    NgClass,
  ],
  templateUrl: './add-url-popup.component.html',
  styleUrl: './add-url-popup.component.scss',
})
export class AddUrlPopupComponent {
  adminService = inject(AdminService)
  fb = inject(NonNullableFormBuilder)
  lang = inject(LocalService)
  ref = inject<MatDialogRef<AddUrlPopupComponent>>(MatDialogRef)
  data = inject<UrlGroup>(MAT_DIALOG_DATA)
  urlForm = this.data ?? createUrlGroup()
  isAdd = signal(!this.data)

  addURL() {
    markAllControlsAsTouchedAndDirty(this.urlForm)

    if (this.urlForm.invalid) return
    this.ref.close(this.urlForm)
  }
  cancel() {
    this.ref.close()
  }
}
