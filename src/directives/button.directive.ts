import { computed, Directive, ElementRef, HostListener, inject, input, Renderer2 } from '@angular/core'

@Directive({
  selector: '[appButton]',
  standalone: true,
  host: {
    '[class]': 'buttonClasses',
    '[attr.disabled]': 'disabled() || null',
    '[attr.aria-disabled]': 'disabled()',
  },
})
export class ButtonDirective {
  color = input<
    | 'primary'
    | 'accent'
    | 'secondary'
    | 'tertiary'
    | 'basic-primary'
    | 'basic-accent'
    | 'basic-secondary'
    | 'basic-tertiary'
  >('primary')
  size = input<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('md')
  shape = input<'rectangle' | 'rounded' | 'pill'>('rounded')
  elevation = input<'none' | 'low' | 'medium' | 'high'>('medium')
  disabled = input(false)

  private _isBasic = computed(() => this.color().includes('basic'))

  private _elementRef = inject(ElementRef)
  private _renderer = inject(Renderer2)

  constructor() {
    if (this._elementRef.nativeElement.nodeName !== 'BUTTON') {
      this._renderer.setAttribute(this._elementRef.nativeElement, 'role', 'button')
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    if (this.disabled()) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  private get buttonClasses(): string {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium whitespace-nowrap',
      'focus:outline-none focus:ring-2',
      'transition-all duration-200 ease-in-out',
      'border border-transparent',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'relative overflow-hidden',
    ]

    const sizeClasses = {
      sm: 'px-3 py-1.5 ltr:pt-2 text-sm/[14px] gap-1',
      md: 'px-4 py-2 ltr:pt-2.5 text-base/4 gap-1.5',
      lg: 'px-5 py-2.5 ltr:pt-3 text-lg/[18px] gap-2',
      xl: 'px-6 py-3 ltr:pt-3.5 text-xl/5 gap-2.5',
      '2xl': 'px-7 py-3.5 ltr:pt-4 text-2xl/[22px] gap-3',
    }

    const colorClasses = {
      primary: 'bg-primary hover:bg-primary-700 disabled:bg-primary text-primary-contrast focus:ring-primary',
      accent: 'bg-accent hover:bg-accent-700 disabled:bg-accent text-accent-contrast focus:ring-accent',
      secondary:
        'bg-secondary hover:bg-secondary-700 disabled:bg-secondary text-secondary-contrast focus:ring-secondary',
      tertiary: 'bg-tertiary hover:bg-tertiary-700 disabled:bg-tertiary text-tertiary-contrast focus:ring-tertiary',
      'basic-primary': 'bg-transparent hover:bg-primary-100 disabled:bg-primary text-primary focus:ring-primary',
      'basic-accent': 'bg-transparent hover:bg-accent-100 disabled:bg-accent text-accent focus:ring-accent',
      'basic-secondary':
        'bg-transparent hover:bg-secondary-100 disabled:bg-secondary text-secondary focus:ring-secondary',
      'basic-tertiary': 'bg-transparent hover:bg-tertiary-100 disabled:bg-tertiary text-tertiary focus:ring-tertiary',
    }

    const shapes = {
      rectangle: 'rounded-none',
      rounded: 'rounded',
      pill: 'rounded-full',
    }

    const elevations = {
      none: 'shadow-none',
      low: 'shadow-sm hover:shadow',
      medium: 'shadow hover:shadow-md',
      high: 'shadow-md hover:shadow-lg',
    }

    return [
      ...baseClasses,
      sizeClasses[this.size()],
      colorClasses[this.color()],
      shapes[this.shape()],
      this._isBasic() ? elevations['none'] : elevations[this.elevation()],
    ].join(' ')
  }
}
