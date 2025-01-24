import { trigger, transition, style, animate, keyframes } from '@angular/animations'

export const searchAnimation = trigger('searchAnimation', [
  transition('* => searching', [
    animate(
      '2s linear',
      keyframes([
        style({ transform: 'translate(0, 0) scale(1)', offset: 0 }),
        style({ transform: 'translate(-5px, -5px) scale(1.1)', offset: 0.25 }),
        style({ transform: 'translate(5px, 5px) scale(1)', offset: 0.5 }),
        style({ transform: 'translate(-5px, 5px) scale(1.1)', offset: 0.75 }),
        style({ transform: 'translate(0, 0) scale(1)', offset: 1 }),
      ])
    ),
  ]),
])
