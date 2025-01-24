import { LocalService } from '@/services/local.service'
import { Component, inject, OnInit, signal } from '@angular/core'
import { ControlContainer, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MatExpansionModule } from '@angular/material/expansion'
import { startWith, takeUntil, tap } from 'rxjs'
import { ChipsInputComponent } from '../chips-input/chips-input.component'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'

@Component({
  selector: 'app-settings-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatExpansionModule, ChipsInputComponent],
  templateUrl: './settings-form.component.html',
  styleUrl: './settings-form.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class SettingsFormComponent extends OnDestroyMixin(class {}) implements OnInit {
  lang = inject(LocalService)
  fb = inject(NonNullableFormBuilder)
  container = inject(ControlContainer)
  parentFormGroup!: FormGroup
  urlIndex = signal(0)
  showTopics = signal(false)

  ngOnInit(): void {
    this.initParent()
    this.listenToMediaCrawlingChange()
  }

  initParent() {
    this.parentFormGroup = this.container.control! as FormGroup
    if (typeof this.container.name === 'number') {
      this.urlIndex.set(this.container.name)
    }
  }
  get settings(): FormGroup {
    return this.parentFormGroup.get('settings') as FormGroup
  }

  get mediaCrawling(): FormControl<boolean> {
    return this.settings.get('mediaCrawling') as FormControl<boolean>
  }

  toggleTopicsList(isMediaCrawling: boolean) {
    if (isMediaCrawling) {
      this.settings.addControl('topics', this.fb.control([]))
    } else {
      const topics = this.settings.get('topics')
      if (topics) {
        this.settings.removeControl('topics')
      }
    }
  }
  listenToMediaCrawlingChange() {
    this.mediaCrawling?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        startWith(this.mediaCrawling?.value),
        tap(val => {
          this.showTopics.set(val)
          this.toggleTopicsList(val)
        })
      )
      .subscribe()
  }
}
