import { LocalService } from '@/services/local.service'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatFormField, MatInput, MatLabel } from '@angular/material/input'
import { MatOption, MatSelect } from '@angular/material/select'

@Component({
  selector: 'app-ms-avatar-settings-popup',
  standalone: true,
  imports: [MatButton, MatLabel, MatFormField, MatInput, MatSelect, MatOption, ReactiveFormsModule],
  templateUrl: './ms-avatar-settings-popup.component.html',
  styleUrl: './ms-avatar-settings-popup.component.scss',
})
export class MsAvatarSettingsPopupComponent implements OnInit {
  lang = inject(LocalService)
  fb = inject(FormBuilder)
  dialogRef = inject(MatDialogRef)
  data: { bgImgUrl: string; size: string } = inject(MAT_DIALOG_DATA)

  form = this.fb.group({ bgImgUrl: '', size: 'Cropped-Portrait' })

  ngOnInit(): void {
    this.form.setValue(this.data)
  }

  save() {
    this.dialogRef.close(this.form.value)
  }
}
