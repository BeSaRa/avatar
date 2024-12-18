import { Routes } from '@angular/router'
import { LandingComponent } from '@/views/landing/landing.component'

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'video-indexer',
    loadComponent: () => import('@/views/video-indexer/video-indexer.component').then(c => c.VideoIndexerComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('@/views/ai-search/ai-search.component').then(c => c.AiSearchComponent),
  },
  {
    path: 'chat-history',
    loadComponent: () => import('@/views/chat-history/chat-history.component').then(c => c.ChatHistoryComponent),
  },
  {
    path: 'doc-intelligence',
    loadComponent: () =>
      import('@/views/document-intelligence/document-intelligence.component').then(
        c => c.DocumentIntelligenceComponent
      ),
  },
  {
    path: 'interactive-chatbot',
    loadComponent: () =>
      import('@/views/interactive-chat/interactive-chat.component').then(c => c.InteractiveChatComponent),
  },
  {
    path: 'web-crawler',
    loadComponent: () =>
      import('@/views/web-crawler-report/web-crawler-report.component').then(c => c.WebCrawlerReportComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
]

export default routes
