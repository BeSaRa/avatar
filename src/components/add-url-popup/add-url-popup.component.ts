import { AdminService } from '@/services/admin.service'
import { LocalService } from '@/services/local.service'
import { Component, inject } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatTabsModule } from '@angular/material/tabs'
import { KeyvaluePairFormComponent } from '../keyvalue-pair-form/keyvalue-pair-form.component'
import { SettingsFormComponent } from '../settings-form/settings-form.component'
import { ChipsInputComponent } from '../chips-input/chips-input.component'

@Component({
  selector: 'app-add-url-popup',
  standalone: true,
  imports: [ReactiveFormsModule, MatTabsModule, KeyvaluePairFormComponent, SettingsFormComponent, ChipsInputComponent],
  templateUrl: './add-url-popup.component.html',
  styleUrl: './add-url-popup.component.scss',
})
export class AddUrlPopupComponent {
  adminService = inject(AdminService)
  lang = inject(LocalService)
  urlForm = this.adminService.createUrlGroup()
}
