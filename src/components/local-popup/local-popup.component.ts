import { Component, inject, OnInit } from '@angular/core'
import { LocalService } from '@/services/local.service'
import { MatButton } from '@angular/material/button'
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { exhaustMap, map, Subject } from 'rxjs'
import { MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-local-popup',
  standalone: true,
  imports: [MatButton, MatLabel, MatFormField, MatInput, ReactiveFormsModule, MatError],
  templateUrl: './local-popup.component.html',
  styleUrl: './local-popup.component.scss',
})
export class LocalPopupComponent implements OnInit {
  lang = inject(LocalService)
  fb = inject(FormBuilder)
  ref = inject(MatDialogRef)

  form = this.fb.nonNullable.group({
    key: ['', Validators.required],
    ar: ['', Validators.required],
    en: ['', Validators.required],
  })

  save = new Subject<void>()

  ngOnInit(): void {
    this.listenToSave()
  }

  private listenToSave() {
    this.save
      .pipe(
        map(() => ({
          key: this.form.value.key!.toLowerCase().trim().replaceAll(' ', '_'),
          ar: this.form.value.ar!,
          en: this.form.value.en!,
        })),
        exhaustMap(model => {
          return this.lang.createLocal(model)
        })
      )
      .subscribe(() => {
        this.ref.close()
      })
  }
}
