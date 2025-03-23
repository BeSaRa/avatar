import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { TemplateDirective } from '@/directives/template.directive'
import { OnChange, OnTouched } from '@/types/CVA-functions-types'
import { OverlayModule } from '@angular/cdk/overlay'
import { NgClass, NgTemplateOutlet } from '@angular/common'
import {
  AfterContentInit,
  Component,
  computed,
  contentChildren,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { OptionValue, SelectedValue } from './dropdown-type'

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [OverlayModule, NgClass, PerfectScrollDirective, NgTemplateOutlet],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DropdownComponent,
      multi: true,
    },
  ],
})
export class DropdownComponent<T = unknown> implements ControlValueAccessor, AfterContentInit {
  items = input.required<T[]>()
  placeholder = input('select an option')
  optionValue = input<OptionValue<T>>()
  optionLabel = input<OptionValue<T>>()
  selectedValue = signal<SelectedValue<T> | undefined>(undefined)
  isDropdownOpen = signal(false)
  disabled = signal<boolean>(false)
  declare iconTemplate: TemplateRef<HTMLElement>
  templates = contentChildren(TemplateDirective)
  onSelect = output<SelectedValue<T>>()

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: OnChange<SelectedValue<T>> = () => {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: OnTouched = () => {}

  computedLabels = computed(() => {
    return new Map(this.items().map(item => [item, this.optionLabel() ? item[this.optionLabel()!] : item]))
  })

  computedValues = computed(() => {
    return new Map(this.items().map(item => [item, this.optionValue() ? item[this.optionValue()!] : item]))
  })

  selectedLabel = computed(() => {
    const selectedItem = (this.items() ?? []).find(item => this.computedValues().get(item) === this.selectedValue())
    return selectedItem ? this.computedLabels().get(selectedItem) : null
  })

  ngAfterContentInit(): void {
    this.templates().forEach(template => {
      switch (template.getName()) {
        case 'icon':
          this.iconTemplate = template.template
      }
    })
  }

  /** Select an item */
  selectItem(item: T) {
    const value = this.computedValues().get(item) as SelectedValue<T>
    this.selectedValue.set(value)
    this.onChange(value)
    this.onSelect.emit(value!)
    this.isDropdownOpen.set(false)
  }

  writeValue(value: SelectedValue<T>): void {
    this.selectedValue.set(value)
  }
  registerOnChange(fn: OnChange<T | T[keyof T] | undefined>): void {
    this.onChange = fn
  }
  registerOnTouched(fn: OnTouched): void {
    this.onTouched = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled)
  }
  markAsTouched() {
    this.onTouched()
  }
}
