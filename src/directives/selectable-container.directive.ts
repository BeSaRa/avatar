import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  NgZone,
  OnDestroy,
  Output,
  Renderer2,
  inject,
} from '@angular/core'
import { SelectableItemDirective } from './selectable-item.directive'

@Directive({
  selector: '[appSelectableContainer]',
  standalone: true,
  exportAs: 'selectableContainer',
})
export class SelectableContainerDirective implements OnDestroy {
  @Output() selectionChange = new EventEmitter<Set<unknown>>() // Emits selected items
  private items: SelectableItemDirective[] = [] // List of registered items
  private selectionBox: HTMLElement | null = null
  private overlay: HTMLElement | null = null
  private isSelecting = false
  private isDragging = false
  private boxStartX = 0
  private boxStartY = 0
  private selectedItems = new Set<unknown>()

  private el = inject(ElementRef)
  private renderer = inject(Renderer2)
  private zone = inject(NgZone)

  constructor() {
    this.zone.runOutsideAngular(() => {
      document.addEventListener('click', this.onDocumentClick, true)
    })
  }

  registerItem(item: SelectableItemDirective): void {
    this.items.push(item)
  }

  toggleSelection(item: unknown, selected: boolean): void {
    const selectableItem = this.items.find(i => i.item === item)
    if (!selectableItem) return

    selectableItem.setSelected(selected)

    if (selected) {
      this.selectedItems.add(item)
    } else {
      this.selectedItems.delete(item)
    }

    this.emitSelectionChange()
  }

  addSelection(item: unknown): void {
    this.selectedItems.add(item)
    this.emitSelectionChange()
  }

  isSelected(item: unknown): boolean {
    return this.selectedItems.has(item)
  }

  @HostListener('click', ['$event'])
  onContainerClick(event: MouseEvent): void {
    const target = event.target as HTMLElement

    if (this.isDragging) return // Skip clearing if a drag occurred

    // Check if the target or its ancestor is an ignored element
    const isIgnored = this.isIgnoredElement(target)

    if (isIgnored) return

    const clickedInsideItem = this.items.some(item => item.el.nativeElement.contains(event.target as Node))
    if (!clickedInsideItem) {
      this.clearSelection()
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return

    this.zone.runOutsideAngular(() => {
      const containerRect = this.el.nativeElement.getBoundingClientRect()
      this.boxStartX = event.clientX - containerRect.left
      this.boxStartY = event.clientY - containerRect.top

      this.createSelectionBox()

      this.isSelecting = true
      this.isDragging = false

      document.addEventListener('mousemove', this.debouncedMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    })
  }

  private onMouseMove = (event: MouseEvent): void => {
    if (!this.isSelecting || !this.selectionBox) return

    const containerRect = this.el.nativeElement.getBoundingClientRect()
    const currentX = Math.min(Math.max(event.clientX - containerRect.left, 0), containerRect.width)
    const currentY = Math.min(Math.max(event.clientY - containerRect.top, 0), containerRect.height)

    const boxX = Math.min(this.boxStartX, currentX)
    const boxY = Math.min(this.boxStartY, currentY)
    const boxWidth = Math.abs(currentX - this.boxStartX)
    const boxHeight = Math.abs(currentY - this.boxStartY)

    this.renderer.setStyle(this.selectionBox, 'left', `${boxX}px`)
    this.renderer.setStyle(this.selectionBox, 'top', `${boxY}px`)
    this.renderer.setStyle(this.selectionBox, 'width', `${boxWidth}px`)
    this.renderer.setStyle(this.selectionBox, 'height', `${boxHeight}px`)

    this.isDragging = true
    this.updateSelectedItems(boxX, boxY, boxX + boxWidth, boxY + boxHeight)
  }

  private onMouseUp = (): void => {
    this.zone.runOutsideAngular(() => {
      this.isSelecting = false
      this.cleanupSelectionBox()

      if (this.isDragging) {
        this.zone.run(() => this.emitSelectionChange())
      }
      document.removeEventListener('mousemove', this.debouncedMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
    })
  }

  private createSelectionBox(): void {
    if (!this.overlay) {
      this.overlay = this.renderer.createElement('div')
      this.renderer.addClass(this.overlay, 'selection-overlay')
      this.renderer.setStyle(this.overlay, 'position', 'absolute')
      this.renderer.setStyle(this.overlay, 'top', '0')
      this.renderer.setStyle(this.overlay, 'left', '0')
      this.renderer.setStyle(this.overlay, 'width', '100%')
      this.renderer.setStyle(this.overlay, 'height', '100%')
      this.renderer.setStyle(this.overlay, 'z-index', '10')
      this.renderer.setStyle(this.overlay, 'pointer-events', 'none')
      this.renderer.appendChild(this.el.nativeElement, this.overlay)
    }

    if (!this.selectionBox) {
      this.selectionBox = this.renderer.createElement('div')
      this.renderer.addClass(this.selectionBox, 'selection-box')
      this.renderer.setStyle(this.selectionBox, 'position', 'absolute')
      this.renderer.setStyle(this.selectionBox, 'background', 'rgba(100, 149, 237, 0.3)')
      this.renderer.setStyle(this.selectionBox, 'border', '1px dashed #6495ED')
      this.renderer.setStyle(this.selectionBox, 'pointer-events', 'none')
      this.renderer.setStyle(this.selectionBox, 'z-index', '20')
      this.renderer.appendChild(this.overlay, this.selectionBox)
    }
  }

  private cleanupSelectionBox(): void {
    if (this.selectionBox) {
      this.renderer.setStyle(this.selectionBox, 'width', '0px')
      this.renderer.setStyle(this.selectionBox, 'height', '0px')
    }
  }

  private updateSelectedItems(boxLeft: number, boxTop: number, boxRight: number, boxBottom: number): void {
    const newSelectedItems = new Set<unknown>()

    this.items.forEach(item => {
      const itemRect = item.getBoundingClientRect()
      const containerRect = this.el.nativeElement.getBoundingClientRect()

      const itemInSelection =
        itemRect.top - containerRect.top < boxBottom &&
        itemRect.bottom - containerRect.top > boxTop &&
        itemRect.left - containerRect.left < boxRight &&
        itemRect.right - containerRect.left > boxLeft

      item.setSelected(itemInSelection)

      if (itemInSelection) {
        newSelectedItems.add(item.item)
      }
    })

    if (!this.areSetsEqual(this.selectedItems, newSelectedItems)) {
      this.selectedItems = newSelectedItems
      this.emitSelectionChange()
    }
  }

  private areSetsEqual(setA: Set<unknown>, setB: Set<unknown>): boolean {
    if (setA.size !== setB.size) return false
    for (const item of setA) {
      if (!setB.has(item)) return false
    }
    return true
  }

  private onDocumentClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement

    const clickedInside = this.el.nativeElement.contains(target)
    // Check if the target or its ancestor is an ignored element
    const isIgnored = this.isIgnoredElement(target)

    if (!clickedInside && !isIgnored) {
      this.zone.run(() => this.clearSelection())
    }
  }

  clearSelection(): void {
    this.selectedItems.clear()
    this.items.forEach(item => item.setSelected(false))
    this.emitSelectionChange()
  }

  emitSelectionChange(): void {
    this.zone.run(() => {
      this.selectionChange.emit(new Set(this.selectedItems))
    })
  }

  private debouncedMouseMove = this.debounce((event: MouseEvent) => {
    this.onMouseMove(event)
  }, 16)

  private debounce(func: (ev: MouseEvent) => void, wait: number): (args: MouseEvent) => void {
    let timeout: NodeJS.Timeout
    return function (...args: [MouseEvent]) {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'a') {
      event.preventDefault() // Prevent default browser behavior (select all text)
      this.selectAllItems()
    }
  }

  selectAllItems(): void {
    this.items.forEach(item => {
      item.setSelected(true)
      this.selectedItems.add(item.item)
    })

    this.emitSelectionChange()
  }

  isIgnoredElement(target: HTMLElement): boolean {
    let currentTarget: HTMLElement | null = target
    while (currentTarget) {
      if (currentTarget.hasAttribute('ignore-el')) {
        return true
      }
      currentTarget = currentTarget.parentElement
    }
    return false
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onDocumentClick, true)
    document.removeEventListener('mousemove', this.debouncedMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  }
}
