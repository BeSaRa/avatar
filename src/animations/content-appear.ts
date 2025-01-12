import { trigger, transition, style, stagger, animate, query } from '@angular/animations'

export const contentAnimation = trigger('contentAnimation', [
  transition(':enter', [
    query(
      '.content-item',
      [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        stagger(100, [animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))]),
      ],
      { optional: true }
    ),
  ]),
])
