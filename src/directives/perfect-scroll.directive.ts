import { ContentObserver } from '@angular/cdk/observers'
import { AfterViewInit, Directive, ElementRef, inject, input, OnDestroy, Renderer2 } from '@angular/core'
import PerfectScrollbar from 'perfect-scrollbar'
import { debounceTime, Subscription } from 'rxjs'

@Directive({
  selector: '[appPerfectScroll]',
  standalone: true,
  exportAs: 'perfectScroll',
})
export class PerfectScrollDirective implements AfterViewInit, OnDestroy {
  elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  renderer2 = inject(Renderer2)
  contentObserver = inject(ContentObserver)
  perfectScrollOptions = input<PerfectScrollbar.Options>({ maxScrollbarLength: 100 })
  stopPropagationOnWheel = input(true)
  observeContent = input(false)
  private perfectScrollbar?: PerfectScrollbar
  private observationSub!: Subscription

  ngAfterViewInit(): void {
    this.renderer2.addClass(this.elementRef.nativeElement, '!relative')
    this.renderer2.addClass(this.elementRef.nativeElement, '!overflow-hidden')
    this.perfectScrollbar = new PerfectScrollbar(this.elementRef.nativeElement, {
      ...this.perfectScrollOptions(),
      wheelPropagation: !this.stopPropagationOnWheel(),
    })

    if (this.observeContent()) {
      this.ObserveContentChange()
    }
  }

  update() {
    this.perfectScrollbar?.update()
  }

  ngOnDestroy(): void {
    if (this.perfectScrollbar) {
      this.perfectScrollbar.destroy()
      this.perfectScrollbar = undefined
    }
    if (this.observationSub) {
      this.observationSub.unsubscribe()
    }
  }

  ObserveContentChange() {
    this.observationSub = this.contentObserver
      .observe(this.elementRef.nativeElement)
      .pipe(debounceTime(100))
      .subscribe(() => {
        setTimeout(() => {
          this.update()
        })
      })
  }
}
