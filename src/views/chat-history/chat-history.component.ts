import { Subject, switchMap, takeUntil, tap } from 'rxjs'
import { Conversation } from '@/models/conversation'
import { ChatHistoryService } from '@/services/chat-history.service'
import { LocalService } from '@/services/local.service'
import { OverlayModule } from '@angular/cdk/overlay'
import { AsyncPipe, NgClass } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatExpansionModule } from '@angular/material/expansion'
import { ChatHistoryChartsComponent } from '../../components/chat-history-charts/chat-history-charts.component'
import { ConversationListComponent } from '../../components/conversation-list/conversation-list.component'
import { HistoryMessage } from '@/models/history-message'
import { TextWriterAnimatorDirective } from '@/directives/text-writer-animator.directive'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'

@Component({
  selector: 'app-chat-history',
  standalone: true,
  imports: [
    MatExpansionModule,
    AsyncPipe,
    NgClass,
    ReactiveFormsModule,
    OverlayModule,
    ChatHistoryChartsComponent,
    ConversationListComponent,
    TextWriterAnimatorDirective,
  ],
  templateUrl: './chat-history.component.html',
  styleUrl: './chat-history.component.scss',
})
export class ChatHistoryComponent extends OnDestroyMixin(class {}) implements OnInit {
  chatHistoryService = inject(ChatHistoryService)
  lang = inject(LocalService)
  conversations = signal<Conversation[]>([])
  chats = signal<HistoryMessage[]>([])
  loaderChat = signal<boolean>(false)
  loader$ = new Subject<'chat' | 'sentiment' | 'conversation' | 'no_loader'>()
  loadConversation$ = new Subject<void>()

  ngOnInit(): void {
    this.loadConversations()
    this.loadConversation$.next()
  }

  loadChat(conversationId: string) {
    this.loaderChat.set(true)
    this.chatHistoryService
      .getChatByConversationId(conversationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.chats.set(res)
        this.loaderChat.set(false)
      })
  }

  loadConversations() {
    this.loadConversation$
      .pipe(switchMap(() => this.chatHistoryService.getAllConversations().pipe(takeUntil(this.destroy$))))
      .pipe(
        tap(() => {
          this.loader$.next('conversation')
        })
      )
      .subscribe(res => {
        this.conversations.set(res)
        this.loader$.next('no_loader')
      })
  }
  sentimentAnalyis() {
    this.chatHistoryService
      .applyAnalysis()
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.loadConversation$.next())
      )
      .subscribe()
  }
}
