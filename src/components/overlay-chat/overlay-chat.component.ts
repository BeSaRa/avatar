import { TextWriterAnimatorDirective } from '@/directives/text-writer-animator.directive'
import { ChatService } from '@/services/chat.service'
import { NgClass } from '@angular/common'
import { Component, ElementRef, inject, Injector, signal, viewChild } from '@angular/core'

@Component({
  selector: 'app-overlay-chat',
  standalone: true,
  imports: [NgClass, TextWriterAnimatorDirective],
  templateUrl: './overlay-chat.component.html',
  styleUrl: './overlay-chat.component.scss',
})
export class OverlayChatComponent {
  container = viewChild.required<ElementRef<HTMLDivElement>>('container')
  injector = inject(Injector)
  service = inject(ChatService)
  animationStatus = signal(false)
}
