import { Component, effect, ElementRef, inject, Injector, OnInit, signal, viewChild } from '@angular/core'
import PerfectScrollbar from 'perfect-scrollbar'
import { ChatService } from '@/services/chat.service'
import { NgClass } from '@angular/common'
import { TextWriterAnimatorDirective } from '@/directives/text-writer-animator.directive'

@Component({
  selector: 'app-overlay-chat',
  standalone: true,
  imports: [NgClass, TextWriterAnimatorDirective],
  templateUrl: './overlay-chat.component.html',
  styleUrl: './overlay-chat.component.scss',
})
export class OverlayChatComponent implements OnInit {
  container = viewChild.required<ElementRef<HTMLDivElement>>('container')
  injector = inject(Injector)
  service = inject(ChatService)
  animationStatus = signal(false)
  declare scrollbar: PerfectScrollbar

  ngOnInit(): void {
    effect(
      () => {
        new PerfectScrollbar(this.container().nativeElement, {})
      },
      { injector: this.injector }
    )
  }
}
