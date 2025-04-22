import { FeedbackChat } from '@/enums/feedback-chat'
import { Conversation } from '@/models/conversation'
import { LocalService } from '@/services/local.service'
import { ChatFilterType } from '@/types/chat-filter-type'
import { OverlayModule } from '@angular/cdk/overlay'
import { DatePipe, NgClass } from '@angular/common'
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core'
import { ReactiveFormsModule, FormControl } from '@angular/forms'
import { MatTooltip } from '@angular/material/tooltip'
import PerfectScrollbar from 'perfect-scrollbar'
import { Subject, combineLatest, startWith, map, tap } from 'rxjs'

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, OverlayModule, MatTooltip, DatePipe],
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.scss',
})
export class ConversationListComponent implements OnInit {
  conversationsContainer = viewChild.required<ElementRef<HTMLDivElement>>('conversationsContainer')
  conversations = input.required<Conversation[]>()
  onConversationSelect = output<string>()

  lang = inject(LocalService)
  searchControl = new FormControl('', { nonNullable: true })

  filterOptions: { label: string; value: ChatFilterType }[] = [
    { label: this.lang.locals.sentiment, value: 'sentiment' },
    { label: this.lang.locals.feedback, value: 'feedback' },
  ]
  showSuggestions = signal(false)
  selectedConversation = signal<string | null>(null)
  selectedFilter = signal<{ label: string; value: ChatFilterType }>(this.filterOptions[0])

  filterType$ = new Subject<ChatFilterType>()
  filterValue$ = new Subject<string | FeedbackChat>()

  filteredConversations = signal<Conversation[]>([])

  dropdownOpen = signal(false)

  feedbackOptions = FeedbackChat

  currentSort: 'asc' | 'desc' = 'asc'

  suggestions = computed(() => {
    if (this.selectedFilter().value === 'feedback') {
      return [
        { label: this.lang.locals.like, value: FeedbackChat.LIKE },
        { label: this.lang.locals.dislike, value: FeedbackChat.DISLIKE },
        { label: this.lang.locals.unspecified, value: FeedbackChat.UNSPECIFIED },
      ]
    }
    if (this.selectedFilter().value === 'sentiment') {
      return [
        { label: this.lang.locals.negative, value: 'negative' },
        { label: this.lang.locals.positive, value: 'positive' },
        { label: this.lang.locals.mixed, value: 'mixed' },
        { label: this.lang.locals.neutral, value: 'neutral' },
        { label: this.lang.locals.unspecified, value: 'undefined' },
      ]
    }
    return []
  })

  ngOnInit(): void {
    this.listenToFilter()
  }

  constructor() {
    effect(() => {
      new PerfectScrollbar(this.conversationsContainer().nativeElement, {
        suppressScrollX: true,
      })
      this.conversationsContainer().nativeElement.addEventListener('wheel', event => {
        event.stopPropagation()
      })
      if (this.conversations()) {
        untracked(() => {
          this.filterType$.next('bot_name')
        })
      }
    })
  }
  loadSuggestions(): void {
    if (['sentiment', 'feedback'].includes(this.selectedFilter().value)) {
      this.showSuggestions.set(true)
    }
  }

  onFilterTypeSelect(option: { label: string; value: ChatFilterType }) {
    this.resetContorl()
    this.selectedFilter.set(option) // Set the selected option
    this.dropdownOpen.set(false) // Close the dropdown
    this.filterValue$.next('')
    this.filterType$.next(option.value)
  }

  onSuggestionSelect(suggestion: { label: string; value: string | FeedbackChat }) {
    this.filterValue$.next(suggestion.value) // Update filter value
    this.searchControl.setValue(suggestion.label, { emitEvent: false }) // Update input value
    this.showSuggestions.set(false) // Hide suggestions
  }

  listenToFilter() {
    // Combine filter type, value, and search
    combineLatest([
      this.filterType$.pipe(startWith(this.selectedFilter().value)), // Trigger on filter type change
      this.filterValue$.pipe(startWith('')), // Avoid rapid changes
    ])
      .pipe(
        map(([filterType, filterValue]) => {
          if (filterType !== 'bot_name' && filterValue === '') {
            return this.conversations()
          }
          return this.conversations().filter(conversation => {
            if (filterType === 'sentiment' && typeof filterValue === 'string') {
              return conversation.sentiment?.toLowerCase() === filterValue.toLowerCase()
            }

            if (filterType === 'feedback') {
              return conversation.feedback === filterValue
            }

            return true
          })
        }),
        tap(filtered => {
          this.filteredConversations.set(filtered)
          this.resetScrollToTop()
        }) // Update filtered conversations
      )
      .subscribe()
  }
  resetScrollToTop() {
    const containerElement = this.conversationsContainer().nativeElement
    if (containerElement) {
      containerElement.scrollTop = 0 // Scroll to top
    }
  }
  OnSelectConversation(conversationId: string) {
    this.selectedConversation.set(conversationId)
    this.onConversationSelect.emit(conversationId)
  }
  resetContorl() {
    this.searchControl.reset('')
    this.filterValue$.next('')
    this.filterType$.next(this.selectedFilter().value)
  }

  sort() {
    this.currentSort = this.currentSort === 'asc' ? 'desc' : 'asc'
    const sorted = this.filteredConversations().sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()

      if (this.currentSort === 'asc') {
        return dateA - dateB // Ascending order
      } else {
        return dateB - dateA // Descending order
      }
    })
    this.filteredConversations.set(sorted)
  }
}
