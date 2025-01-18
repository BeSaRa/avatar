import { LocalService } from '@/services/local.service'
import { Component, inject, OnInit, signal } from '@angular/core'
import { ControlContainer, FormArray, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MatExpansionModule } from '@angular/material/expansion'
import { tap } from 'rxjs'

@Component({
  selector: 'app-settings-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatExpansionModule],
  templateUrl: './settings-form.component.html',
  styleUrl: './settings-form.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class SettingsFormComponent implements OnInit {
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

  get selectorsArray(): FormArray {
    return this.settings.get('selectors') as FormArray
  }

  get topicsArray(): FormArray {
    return this.settings.get('topics') as FormArray
  }

  addSelector() {
    this.selectorsArray.push(this.fb.control(''))
  }
  removeSelector(index: number) {
    this.selectorsArray.removeAt(index)
  }
  addTopic() {
    this.topicsArray.push(this.fb.control(''))
  }
  removeTopic(index: number) {
    this.topicsArray.removeAt(index)
  }

  toggleTopicsList(isMediaCrawling: boolean) {
    if (isMediaCrawling) {
      this.settings.addControl('topics', this.fb.array([]))
    } else {
      const topics = this.settings.get('topics')
      if (topics) {
        this.settings.removeControl('topics')
      }
    }
  }
  listenToMediaCrawlingChange() {
    this.settings
      .get('mediaCrawling')
      ?.valueChanges.pipe(
        tap(val => {
          this.showTopics.set(val)
          this.toggleTopicsList(val)
        })
      )
      .subscribe()
  }
}
