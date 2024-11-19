import { ChatHistoryService } from '@/services/chat-history.service'
import { LocalService } from '@/services/local.service'
import { OverlayModule } from '@angular/cdk/overlay'
import { AsyncPipe, NgClass } from '@angular/common'
import { Component, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatExpansionModule } from '@angular/material/expansion'
import PerfectScrollbar from 'perfect-scrollbar'
import { debounceTime } from 'rxjs'

@Component({
  selector: 'app-chat-history',
  standalone: true,
  imports: [MatExpansionModule, AsyncPipe, NgClass, ReactiveFormsModule, OverlayModule],
  templateUrl: './chat-history.component.html',
  styleUrl: './chat-history.component.scss',
})
export class ChatHistoryComponent implements OnInit {
  conversationsContainer = viewChild.required<ElementRef<HTMLDivElement>>('conversationsContainer')
  chatHistoryService = inject(ChatHistoryService)
  lang = inject(LocalService)
  searchControl = new FormControl('', { nonNullable: true })
  filterOptions = signal([
    { label: this.lang.locals.bot_name, value: 'bot_name' },
    { label: this.lang.locals.sentiment, value: 'sentiment' },
    { label: this.lang.locals.feedback, value: 'feedback' },
  ])
  showSuggestions = signal(false)
  selectedConversation = signal<string | null>(null)
  selectedFilter = signal<string | null>(null)

  conversations$ = this.chatHistoryService.getAllConversations()
  dropdownOpen = false

  ngOnInit(): void {
    this.onSearch()
  }
  selectOption(option: { label: string; value: string }) {
    this.selectedFilter.set(option.label) // Set the selected option
    this.dropdownOpen = false // Close the dropdown
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen // Toggle the dropdown
  }
  closeDropdown() {
    this.dropdownOpen = false // Close dropdown
  }

  constructor() {
    effect(() => {
      new PerfectScrollbar(this.conversationsContainer().nativeElement)
    })
  }

  onSearch() {
    this.searchControl.valueChanges.pipe(debounceTime(400)).subscribe(query => this.handleQuery(query))
  }
  handleQuery(query: string) {
    if (query.endsWith('@')) {
      this.showSuggestions.set(true) // Show suggestions when `@` is the last character
    } else if (query.match(/@\w*$/)) {
      this.showSuggestions.set(true) // Keep showing suggestions if typing after `@`
    } else {
      this.showSuggestions.set(false) // Hide suggestions otherwise
    }
  }
  loadChat(conversationId: string) {
    this.selectedConversation.set(conversationId)
    this.chatHistoryService.getChatByConversationId(conversationId).subscribe(res => {
      console.log(res)
    })
  }
}
