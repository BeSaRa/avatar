import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { LocalService } from '@/services/local.service'
import { NgClass } from '@angular/common'
import { Component, ElementRef, inject, input, OnInit, signal, viewChildren } from '@angular/core'
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'

@Component({
  selector: 'app-keyvalue-pair-form',
  standalone: true,
  imports: [ReactiveFormsModule, PerfectScrollDirective, NgClass],
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
  keyInputs = viewChildren<ElementRef<HTMLInputElement>>('keyInput')
  valueInputs = viewChildren<ElementRef<HTMLInputElement>>('valueInput')

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
    contorl.push(
      this.fb.group({
        key: this.fb.control('', [Validators.required]),
        value: this.fb.control('', [Validators.required]),
      })
    )
    setTimeout(() => {
      const keyInput = this.keyInputs().at(-1)
      if (keyInput) {
        keyInput.nativeElement.focus()
      }
    }, 0)
  }

  get getKeyValuePairArray(): FormArray {
    return this.parentFormGroup.get(this.arrayName()) as FormArray
  }

  removeKeyValuePair(index: number) {
    const contorl = this.parentFormGroup.get(this.arrayName())
    this.checkFormArray(contorl!)
    contorl.removeAt(index)
  }

  handleEnter(event: KeyboardEvent, rowIndex: number, cellType: 'key' | 'value'): void {
    const row = this.getKeyValuePairArray.at(rowIndex)
    const keyControl = row?.get('key')
    const valueControl = row?.get('value')

    if (event.key === 'Backspace') {
      if (cellType === 'value' && valueControl?.value === '') {
        // Move focus to the key input if value input is empty
        event.preventDefault()
        const keyInput = this.keyInputs()[rowIndex]?.nativeElement
        keyInput?.focus()
      } else if (keyControl?.value === '' && valueControl?.value === '') {
        // Remove the row if both key and value are empty
        event.preventDefault()
        this.removeKeyValuePair(rowIndex)
        setTimeout(() => {
          if (this.valueInputs().length) {
            const lastItemValue = this.valueInputs().at(-1)
            lastItemValue?.nativeElement.focus()
          }
        }, 0)
      }
    }

    if (event.key === 'Enter') {
      event.preventDefault() // Prevent default "Enter" behavior

      const totalRows = this.getKeyValuePairArray.length
      const isLastRow = rowIndex === totalRows - 1
      const isKeyCell = cellType === 'key'

      if (isKeyCell) {
        // Focus value input of the same row
        this.valueInputs()[rowIndex]?.nativeElement.focus()
      } else if (!isLastRow) {
        // Focus key input of the next row
        this.keyInputs()[rowIndex + 1]?.nativeElement.focus()
      } else {
        // Add a new row and focus its first cell
        this.addKeyValuePair()
        setTimeout(() => {
          this.keyInputs()[this.getKeyValuePairArray.length - 1]?.nativeElement.focus()
        }, 0)
      }
    }
  }
}
