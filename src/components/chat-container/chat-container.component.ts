import {
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  Injector,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core'
import { MatTooltipModule } from '@angular/material/tooltip'
import { AsyncPipe, DOCUMENT, NgClass } from '@angular/common'
import { TextWriterAnimatorDirective } from '@/directives/text-writer-animator.directive'
import { LocalService } from '@/services/local.service'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { BaseChatService } from '@/services/base-chat.service'
import { FeedbackChat } from '@/enums/feedback-chat'
import { ChatHistoryService } from '@/services/chat-history.service'
import PerfectScrollbar from 'perfect-scrollbar'
import { catchError, exhaustMap, filter, map, skipWhile, Subject, takeUntil, tap } from 'rxjs'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { ignoreErrors } from '@/utils/utils'
import { RecorderComponent } from '../recorder/recorder.component'
import { AvatarVideoComponent } from '../avatar-video/avatar-video.component'
import { AvatarInterrupterBtnComponent } from '../avatar-interrupter-btn/avatar-interrupter-btn.component'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { ChatService } from '@/services/chat.service'

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTooltipModule,
    NgClass,
    TextWriterAnimatorDirective,
    RecorderComponent,
    AvatarVideoComponent,
    AvatarInterrupterBtnComponent,
    CdkDrag,
    CdkDragHandle,
    AsyncPipe,
  ],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.scss',
  providers: [ChatService],
})
export class ChatContainerComponent extends OnDestroyMixin(class {}) implements OnInit {
  lang = inject(LocalService)
  chatService = inject(ChatService)
  injector = inject(Injector)
  document = inject(DOCUMENT)
  chatHistoryService = inject(ChatHistoryService)
  status = signal(true)
  showAvatarBtn = input(true)
  showClearMsgBtn = input(true)
  showFullScreenBtn = input(true)
  showHideBtn = input(true)
  showRatingBox = input(true)
  showRecorderBtn = input(true)
  title = input(this.lang.locals.chat)
  containerClass = input('')
  botNameOptions = input.required<
    { showBotSelection: true; botName?: string } | { showBotSelection: false; botName: string }
  >()
  clearMessageOnly = input(false)
  chatContainer = viewChild.required<ElementRef<HTMLDivElement>>('chatContainer')
  chatBodyContainer = viewChild<ElementRef<HTMLDivElement>>('chatBody')
  messageInput = viewChild.required<ElementRef<HTMLTextAreaElement>>('textArea')
  recorder = viewChild<RecorderComponent>('recorder')
  avatarOn = false
  fullscreenStatus = signal(false)
  answerInProgress = signal(false)
  animating = signal(false)
  stopAnimate = signal(false)
  ratingDone = signal(false)
  botNames$ = this.chatHistoryService.getAllBotNames()
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
  // noinspection JSUnusedGlobalSymbols
  statusEffect = effect(() => {
    if (this.status()) {
      const timeoutID = setTimeout(() => {
        this.messageInput().nativeElement.focus()
        clearTimeout(timeoutID)
      })
    }
  })

  messageCtrl = new FormControl<string>('', { nonNullable: true })
  sendMessage$ = new Subject<void>()

  ngOnInit() {
    this.listenToSendMessage()
    this.listenToBotNameChange()
  }
  listenToBotNameChange() {
    this.chatService
      .onBotNameChange()
      .pipe(
        takeUntil(this.destroy$),
        skipWhile(() => !this.botNameOptions().showBotSelection)
      )
      .subscribe()
  }

  toggleChat() {
    this.status.update(value => !value)
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
          this.chatService
            .sendMessage(
              value,
              this.botNameOptions().showBotSelection
                ? this.chatService.botNameCtrl.value
                : this.botNameOptions().botName!
            )
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
    if (this.clearMessageOnly()) {
      this.chatService.messages.set([])
      return
    }
    this.chatService.messages.set([])
    this.chatService.conversationId.set('')
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
    const conversationId = this.chatService.conversationId()
    this.chatHistoryService
      .addFeedback(conversationId, feedback)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.ratingDone.set(true)
      })
  }
}
