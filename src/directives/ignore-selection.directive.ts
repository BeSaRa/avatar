import { Directive, ElementRef, Renderer2, OnInit, inject } from '@angular/core'

@Directive({
  selector: '[appIgnoreSelection]',
  standalone: true,
})
export class IgnoreSelectionDirective implements OnInit {
  private renderer = inject(Renderer2)
  private el = inject(ElementRef)

  ngOnInit(): void {
    // Add the 'ignore-el' attribute to the element
    this.renderer.setAttribute(this.el.nativeElement, 'ignore-el', 'true')
  }
}
