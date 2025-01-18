import { LocalService } from '@/services/local.service'
import { Component, inject, input, OnInit, signal } from '@angular/core'
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms'

@Component({
  selector: 'app-keyvalue-pair-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './keyvalue-pair-form.component.html',
  styleUrl: './keyvalue-pair-form.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class KeyvaluePairFormComponent implements OnInit {
  parentFormGroup!: FormGroup
  container = inject(ControlContainer)
  arrayName = input.required<string>()
  fb = inject(NonNullableFormBuilder)
  buttonLabel = input.required<string>()
  lang = inject(LocalService)
  urlIndex = signal(0)

  ngOnInit(): void {
    this.parentFormGroup = this.container.control as FormGroup
    this.urlIndex.set(this.container.name as number)
  }

  checkFormArray(contorl: AbstractControl): asserts contorl is FormArray {
    if (!(contorl instanceof FormArray)) {
      throw Error('Please Pass Array')
    }
  }
  addKeyValuePair(): void {
    const contorl = this.parentFormGroup.get(this.arrayName())
    this.checkFormArray(contorl!)
    contorl.push(this.fb.group({ key: this.fb.control(''), value: this.fb.control('') }))
  }

  get getKeyValuePairArray(): FormArray {
    return this.parentFormGroup.get(this.arrayName()) as FormArray
  }

  removeKeyValuePair(index: number) {
    const contorl = this.parentFormGroup.get(this.arrayName())
    this.checkFormArray(contorl!)
    contorl.removeAt(index)
  }
}
