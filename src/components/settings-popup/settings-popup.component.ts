import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { ConfigService } from '@/services/config.service'
import { LocalService } from '@/services/local.service'
import { AppStore } from '@/stores/app.store'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatSlideToggle } from '@angular/material/slide-toggle'
import { getState } from '@ngrx/signals'
import { Subject, tap } from 'rxjs'

@Component({
  selector: 'app-settings-popup',
  standalone: true,
  imports: [MatFormField, MatLabel, MatInput, MatSlideToggle, MatButton, ReactiveFormsModule, MatSelectModule],
  templateUrl: './settings-popup.component.html',
  styleUrl: './settings-popup.component.scss',
})
export class SettingsPopupComponent extends OnDestroyMixin(class {}) implements OnInit {
  lang = inject(LocalService)
  store = inject(AppStore)
  config = inject(ConfigService)
  settings = getState(this.store)
  clonedSettings = structuredClone(this.settings)
  save$ = new Subject<void>()
  form = inject(FormBuilder).nonNullable.group({
    logoUrl: [this.settings.logoUrl, Validators.required],
    backgroundUrl: [this.settings.backgroundUrl, Validators.required],
    backgroundColor: [this.settings.backgroundColor, Validators.required],
    idleAvatar: [this.settings.idleAvatar, Validators.required],
    videoToken: [this.settings.videoToken, Validators.required],
    isVideo: [this.settings.isVideo, Validators.required],
    preview: [this.settings.preview, Validators.required],
  })

  ngOnInit(): void {
    this.listenToSave()
  }

  private listenToSave() {
    this.save$.pipe(tap(() => this.store.updateState(this.form.value))).subscribe()
  }
}
