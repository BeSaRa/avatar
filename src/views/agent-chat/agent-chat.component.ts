import { AgentTaskStatusPopupComponent } from '@/components/agent-task-status-popup/agent-task-status-popup.component'
import { AvatarInterrupterBtnComponent } from '@/components/avatar-interrupter-btn/avatar-interrupter-btn.component'
import { AvatarVideoComponent } from '@/components/avatar-video/avatar-video.component'
import { RecorderComponent } from '@/components/recorder/recorder.component'
import { TextWriterAnimatorDirective } from '@/directives/text-writer-animator.directive'
import { FeedbackChat } from '@/enums/feedback-chat'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { AgentMessage } from '@/models/agent-message'
import { AgentChatService } from '@/services/agent-chat.service'
import { ChatHistoryService } from '@/services/chat-history.service'
import { LocalService } from '@/services/local.service'
import { ignoreErrors } from '@/utils/utils'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { CommonModule, DOCUMENT } from '@angular/common'
import { Component, effect, ElementRef, HostListener, inject, Injector, OnInit, signal, viewChild } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { MatTooltipModule } from '@angular/material/tooltip'
import PerfectScrollbar from 'perfect-scrollbar'
import { catchError, exhaustMap, filter, map, Subject, takeUntil, tap } from 'rxjs'

@Component({
  selector: 'app-agent-chat',
  standalone: true,
  imports: [
    CommonModule,
    AvatarVideoComponent,
    AvatarInterrupterBtnComponent,
    TextWriterAnimatorDirective,
    MatTooltipModule,
    ReactiveFormsModule,
    RecorderComponent,
    CdkDrag,
    CdkDragHandle,
  ],
  templateUrl: './agent-chat.component.html',
  styleUrl: './agent-chat.component.scss',
})
export class AgentChatComponent extends OnDestroyMixin(class {}) implements OnInit {
  agentChatService = inject(AgentChatService)
  avatarOn = false
  recorder = viewChild<RecorderComponent>('recorder')
  injector = inject(Injector)
  document = inject(DOCUMENT)
  lang = inject(LocalService)
  chatHistoryService = inject(ChatHistoryService)
  private readonly dialog = inject(MatDialog)

  chatContainer = viewChild.required<ElementRef<HTMLDivElement>>('chatContainer')
  chatBodyContainer = viewChild<ElementRef<HTMLDivElement>>('chatBody')
  messageInput = viewChild.required<ElementRef<HTMLTextAreaElement>>('textArea')
  fullscreenStatus = signal(false)
  answerInProgress = signal(false)
  animating = signal(false)
  stopAnimate = signal(false)
  ratingDone = signal(false)
  declare scrollbarRef: PerfectScrollbar
  feedbackOptions = FeedbackChat
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
  // noinspection JSUnusedGlobalSymbols
  animatingEffect = effect(() => {
    if (!this.animating()) {
      const elements = this.chatBodyContainer()?.nativeElement?.querySelectorAll('.chat-message')
      const last = elements && elements[elements.length - 1]

      last && last.scrollIntoView(true)
    }
  })

  statusEffect = effect(() => {
    const timeoutID = setTimeout(() => {
      this.messageInput().nativeElement.focus()
      clearTimeout(timeoutID)
    })
  })

  messageCtrl = new FormControl<string>('', { nonNullable: true })
  sendMessage$ = new Subject<void>()

  ngOnInit(): void {
    this.listenToSendMessage()
    this.detectFullScreenMode()
  }

  fullScreenToggle() {
    console.log(this.chatContainer().nativeElement)
    if (!this.document.fullscreenElement) {
      this.chatContainer()
        .nativeElement.requestFullscreen()
        .then(() => this.fullscreenStatus.set(true))
    } else {
      this.document.exitFullscreen().then(() => this.fullscreenStatus.set(false))
    }
  }

  private listenToSendMessage() {
    return this.sendMessage$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(() => !!this.messageCtrl.value.trim()))
      .pipe(map(() => this.messageCtrl.value.trim()))
      .pipe(tap(() => this.stopAnimate.set(false)))
      .pipe(tap(() => this.messageCtrl.setValue('')))
      .pipe(tap(() => this.recorder()?.cleartext()))
      .pipe(tap(() => this.answerInProgress.set(true)))
      .pipe(tap(() => this.goToEndOfChat()))
      .pipe(
        exhaustMap(value =>
          this.agentChatService
            .sendUserMessage(value)
            .pipe(
              catchError(err => {
                this.answerInProgress.set(false)
                throw new Error(err)
              })
            )
            .pipe(ignoreErrors())
        )
      )
      .subscribe(() => {
        this.answerInProgress.set(false)
        Promise.resolve().then(() => {
          this.messageInput()?.nativeElement?.focus()
          const timeoutID = setTimeout(() => {
            this.scrollToTop()
            clearInterval(timeoutID)
          }, 50)
        })
      })
  }

  scrollToTop(): void {
    const elements = this.chatBodyContainer()?.nativeElement?.querySelectorAll('.chat-message')
    const lastElement = elements && elements[elements.length - 1]
    const intervalID = setInterval(() => {
      lastElement && lastElement.scrollIntoView(true)
    }, 50)

    effect(
      onCleanup => {
        !this.animating() && intervalID && clearInterval(intervalID)
        onCleanup(() => {
          intervalID && clearInterval(intervalID)
        })
      },
      { injector: this.injector }
    )
  }

  private goToEndOfChat() {
    const timeoutID = setTimeout(() => {
      const elements = this.chatBodyContainer()?.nativeElement?.querySelectorAll('.user-message')
      elements && elements[elements.length - 1]?.scrollIntoView(true)
      clearTimeout(timeoutID)
    })
  }

  clearChatHistory() {
    this.agentChatService.messages.set([])
    this.agentChatService.conversationId.set('')
    this.ratingDone.set(false)
  }

  toggleAvatar() {
    this.avatarOn = !this.avatarOn
  }

  @HostListener('window:fullscreenchange')
  detectFullScreenMode() {
    const isFullscreen = !!this.document.fullscreenElement
    if (!isFullscreen) {
      this.fullscreenStatus.set(isFullscreen)
    }
  }

  rateConversation(feedback: FeedbackChat) {
    const conversationId = this.agentChatService.conversationId()
    this.chatHistoryService
      .addFeedback(conversationId, feedback)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.ratingDone.set(true)
      })
  }

  animatingChange(value: boolean, message?: AgentMessage) {
    this.animating.set(value)
    message && (message.isAnimating = value)
  }

  formatColHead(title: string) {
    return title
      .split('_')
      .map(w => w[0].toUpperCase() + w.slice(1))
      .join(' ')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateTaskStatus(task: Record<string, any>) {
    this.dialog.open(AgentTaskStatusPopupComponent, { data: task }).afterClosed().subscribe()
  }
}
