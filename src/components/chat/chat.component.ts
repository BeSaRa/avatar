import { Component, computed, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core'
import { MatRipple } from '@angular/material/core'
import { LocalService } from '@/services/local.service'
import { DOCUMENT } from '@angular/common'
import { catchError, exhaustMap, filter, map, Subject, takeUntil, tap } from 'rxjs'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import PerfectScrollbar from 'perfect-scrollbar'
import { ChatService } from '@/services/chat.service'
import { ignoreErrors } from '@/utils/utils'
import { TextWriterAnimatorDirective } from '@/directives/text-writer-animator.directive'

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MatRipple, ReactiveFormsModule, TextWriterAnimatorDirective],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent extends OnDestroyMixin(class {}) implements OnInit {
  status = signal(false)
  statusWord = computed(() => (this.status() ? 'opened' : 'closed'))
  document = inject(DOCUMENT)
  lang = inject(LocalService)
  chatService = inject(ChatService)
  chatContainer = viewChild.required<ElementRef<HTMLDivElement>>('chatContainer')
  chatBodyContainer = viewChild<ElementRef<HTMLDivElement>>('chatBody')
  fullscreenStatus = signal(false)
  answerInProgress = signal(false)
  declare scrollbarRef: PerfectScrollbar
  // noinspection JSUnusedGlobalSymbols
  chatBodyContainerEffect = effect(() => {
    if (this.chatBodyContainer()) {
      this.scrollbarRef = new PerfectScrollbar(this.chatBodyContainer()!.nativeElement)
    } else {
      this.scrollbarRef && this.scrollbarRef.destroy()
    }
  })
  // noinspection JSUnusedGlobalSymbols
  answerInProgressEffect = effect(() => {
    if (this.answerInProgress()) {
      this.messageCtrl.disable()
    } else {
      this.messageCtrl.enable()
    }
  })

  messageCtrl = new FormControl<string>('', { nonNullable: true })
  sendMessage$ = new Subject<void>()

  ngOnInit(): void {
    this.listenToSendMessage()
  }

  toggleChat() {
    this.status.update(value => !value)
  }

  fullScreenToggle() {
    if (!this.document.fullscreenElement) {
      this.chatContainer()
        .nativeElement.requestFullscreen()
        .then(() => this.fullscreenStatus.set(true))
    } else {
      this.document.exitFullscreen().then(() => this.fullscreenStatus.set(false))
    }
  }

  private listenToSendMessage() {
    this.sendMessage$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(() => !!this.messageCtrl.value.trim()))
      .pipe(map(() => this.messageCtrl.value.trim()))
      .pipe(tap(() => this.messageCtrl.setValue('')))
      .pipe(tap(() => this.answerInProgress.set(true)))
      .pipe(
        exhaustMap(value =>
          this.chatService
            .sendMessage(value)
            .pipe(
              catchError(err => {
                this.answerInProgress.set(false)
                throw new Error(err)
              })
            )
            .pipe(ignoreErrors())
        )
      )
      .subscribe(() => this.answerInProgress.set(false))
  }
}
