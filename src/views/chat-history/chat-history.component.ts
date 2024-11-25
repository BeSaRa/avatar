import { BehaviorSubject, finalize, Subject, switchMap, takeUntil, tap } from 'rxjs'
import { Conversation } from '@/models/conversation'
import { ChatHistoryService } from '@/services/chat-history.service'
import { LocalService } from '@/services/local.service'
import { OverlayModule } from '@angular/cdk/overlay'
import { AsyncPipe } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatExpansionModule } from '@angular/material/expansion'
import { ChatHistoryChartsComponent } from '../../components/chat-history-charts/chat-history-charts.component'
import { ConversationListComponent } from '../../components/conversation-list/conversation-list.component'
import { HistoryMessage } from '@/models/history-message'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { MatTooltip } from '@angular/material/tooltip'

@Component({
  selector: 'app-chat-history',
  standalone: true,
  imports: [
    MatExpansionModule,
    AsyncPipe,
    ReactiveFormsModule,
    OverlayModule,
    ChatHistoryChartsComponent,
    ConversationListComponent,
    OverlayModule,
    MatTooltip,
  ],
  templateUrl: './chat-history.component.html',
  styleUrl: './chat-history.component.scss',
})
export class ChatHistoryComponent extends OnDestroyMixin(class {}) implements OnInit {
  chatHistoryService = inject(ChatHistoryService)
  lang = inject(LocalService)
  conversations = signal<Conversation[]>([])
  chats = signal<HistoryMessage[]>([])
  loaderChat$ = new BehaviorSubject<boolean>(false)
  loaderSentiment$ = new BehaviorSubject<boolean>(false)
  conversationLoader$ = new BehaviorSubject<boolean>(false)
  loadConversation$ = new Subject<string | undefined>()
  botNames = signal<string[]>([this.lang.locals.all_bots])
  showBotDp = signal(false)
  selectedBot = signal<string>(this.botNames()[0])

  ngOnInit(): void {
    this.loadConversations()
    this.loadConversation$.next(undefined)
    this.getBotNames()
  }

  loadChat(conversationId: string) {
    this.loaderChat$.next(true)
    this.chatHistoryService
      .getChatByConversationId(conversationId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loaderChat$.next(false))
      )
      .subscribe(res => {
        this.chats.set(res)
      })
  }

  loadConversations() {
    this.loadConversation$
      .pipe(
        tap(() => {
          this.conversationLoader$.next(true) // Show loader when new value is emitted
        }),
        switchMap(botName => this.chatHistoryService.getAllConversations(botName)),
        tap(() => {
          this.conversationLoader$.next(false) // Hide loader after data is fetched
        }),
        takeUntil(this.destroy$) // Ensure proper cleanup
      )
      .subscribe(res => {
        this.conversations.set(res) // Update the conversations
      })
  }

  sentimentAnalyis() {
    this.loaderSentiment$.next(true)
    this.chatHistoryService
      .applyAnalysis()
      .pipe(
        takeUntil(this.destroy$),
        tap(() =>
          this.loadConversation$.next(this.selectedBot() === this.lang.locals.all_bots ? undefined : this.selectedBot())
        ),
        finalize(() => this.loaderSentiment$.next(false))
      )
      .subscribe()
  }

  getBotNames() {
    return this.chatHistoryService
      .getAllBotNames()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => this.botNames.set([...this.botNames(), ...res]))
  }
  onBotSelect(botName: string) {
    this.selectedBot.set(botName)
    this.showBotDp.set(false)
    this.loadConversation$.next(botName === this.lang.locals.all_bots ? undefined : botName)
  }
  reloadConversations() {
    this.loadConversation$.next(this.selectedBot() === this.lang.locals.all_bots ? undefined : this.selectedBot())
  }
}
