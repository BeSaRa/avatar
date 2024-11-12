import { trigger, transition, style, animate } from '@angular/animations'

export const fadeInSlideUp = trigger('fadeInSlideUp', [
  transition(':enter, * => *', [
    // Run animation on each change
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
])
