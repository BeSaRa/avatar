import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { LocalService } from '@/services/local.service'
import { OnChange, OnTouched } from '@/types/CVA-functions-types'
import { Component, forwardRef, HostListener, inject, input, model } from '@angular/core'
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips'

@Component({
  selector: 'app-chips-input',
  standalone: true,
  imports: [MatChipsModule, ReactiveFormsModule, PerfectScrollDirective],
  templateUrl: './chips-input.component.html',
  styleUrls: ['./chips-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipsInputComponent),
      multi: true,
    },
  ],
})
export class ChipsInputComponent implements ControlValueAccessor {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: OnChange<string[]> = () => {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: OnTouched = () => {}
  chips: string[] = []
  disabled = model(false)
  placeholder = input('Add a tag...')
  error = ''
  lang = inject(LocalService)
  formControl = new FormControl([])

  addChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim()
    if (!value) {
      this.error = `${this.lang.locals.tag_empty}`
      return
    }

    if (this.chips.includes(value)) {
      this.error = `${this.lang.locals.tag_exist}`
      return
    }

    this.chips.push(value)
    this.onChange(this.chips)
    event.chipInput!.clear()
    this.error = ''
  }

  removeChip(index: number): void {
    this.chips.splice(index, 1)
  }

  writeValue(chips: string[]): void {
    this.chips = chips
    this.onChange(chips)
  }
  registerOnChange(fn: OnChange<string[]>): void {
    this.onChange = fn
  }
  registerOnTouched(fn: OnTouched): void {
    this.onTouched = fn
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled)
  }

  @HostListener('focusout')
  onFocusOut() {
    this.onTouched()
  }
}
