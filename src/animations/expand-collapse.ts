import { trigger, style, transition, animate } from '@angular/animations'

export const expandCollapse = trigger('expandCollapse', [
  transition(':enter', [
    style({ height: '0px', opacity: 0, overflow: 'hidden' }),
    animate('300ms ease-out', style({ height: '*', opacity: 1 })),
  ]),
  transition(':leave', [animate('300ms ease-in', style({ height: '0px', opacity: 0, overflow: 'hidden' }))]),
])
