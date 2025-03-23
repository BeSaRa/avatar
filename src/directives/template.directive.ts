import { Directive, inject, input, TemplateRef } from '@angular/core'

@Directive({
  selector: '[appTemplate]',
  standalone: true,
})
export class TemplateDirective<TType> {
  name = input.required({ alias: 'appTemplate' })
  template = inject(TemplateRef)

  getName() {
    return this.name() as TType
  }
}
