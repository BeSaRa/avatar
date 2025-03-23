import { OnChange, OnTouched } from '@/types/CVA-functions-types'
import { NgClass } from '@angular/common'
import { Component, forwardRef, input, model, output } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [NgClass],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  checked = model(false)

  label = input('')
  id = input('checkbox')
  classes = input('')

  onSelect = output<boolean>()

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: OnTouched = () => {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: OnChange<boolean> = () => {}

  // Handle checkbox value changes
  onChecked(event: Event): void {
    const inputElement = event.target as HTMLInputElement
    this.checked.set(inputElement.checked)
    this.onSelect.emit(inputElement.checked)
    this.onChange(inputElement.checked)
  }

  writeValue(value: boolean): void {
    this.checked.update(() => !!value)
  }

  registerOnChange(fn: OnChange<boolean>): void {
    this.onChange = fn
  }

  registerOnTouched(fn: OnTouched): void {
    this.onTouched = fn
  }

  markAsTouched(): void {
    this.onTouched()
  }
}
