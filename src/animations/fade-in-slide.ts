import { trigger, transition, style, animate } from '@angular/animations'

export const fadeInSlideUp = trigger('fadeInSlideUp', [
  transition(':enter, * => *', [
    // Run animation on each change
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
])

export const slideFromBottom = trigger('slideFromBottom', [
  transition(':enter', [
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
  ]),
  transition(':leave', [animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))]),
])

export const slideIn = trigger('slideIn', [
  transition(':enter', [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate('500ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
  ]),
])
