import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core'
import { SelectableContainerDirective } from './selectable-container.directive'

@Directive({
  selector: '[appSelectableItem]',
  standalone: true,
})
export class SelectableItemDirective {
  @Input('appSelectableItem') item: unknown // Input to identify the item
  el = inject(ElementRef)
  container = inject(SelectableContainerDirective)

  constructor() {
    this.container.registerItem(this)
    this.el.nativeElement.setAttribute('role', 'option')
  }

  setSelected(selected: boolean): void {
    if (selected) {
      this.el.nativeElement.classList.add('selected')
      this.el.nativeElement.setAttribute('aria-selected', 'true')
    } else {
      this.el.nativeElement.classList.remove('selected')
      this.el.nativeElement.setAttribute('aria-selected', 'false')
    }
  }

  getBoundingClientRect(): DOMRect {
    return this.el.nativeElement.getBoundingClientRect()
  }

  @HostListener('click', ['$event.ctrlKey'])
  onClick(ctrlPressed: boolean): void {
    const isSelected = this.container.isSelected(this.item)

    if (ctrlPressed) {
      // Toggle selection when Ctrl is pressed
      this.container.toggleSelection(this.item, !isSelected)
    } else {
      // Clear previous selection and select this item
      this.container.clearSelection()
      this.container.toggleSelection(this.item, !isSelected)
    }
  }
}
