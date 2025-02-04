import { PermissionRouteData } from '@/contracts/permission-rout-data'
import { PermissionGuard } from '@/guards/permission.guard'
import { LandingComponent } from '@/views/landing/landing.component'
import { Routes } from '@angular/router'

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'video-indexer',
    loadComponent: () => import('@/views/video-indexer/video-indexer.component').then(c => c.VideoIndexerComponent),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: ['MEDIA'], hasAnyPermission: false } as PermissionRouteData,
  },
  {
    path: 'search',
    loadComponent: () => import('@/views/ai-search/ai-search.component').then(c => c.AiSearchComponent),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: ['SEARCH'], hasAnyPermission: false } as PermissionRouteData,
  },
  {
    path: 'chat-history',
    loadComponent: () => import('@/views/chat-history/chat-history.component').then(c => c.ChatHistoryComponent),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: ['CHATBOT'], hasAnyPermission: false } as PermissionRouteData,
  },
  {
    path: 'doc-intelligence',
    loadComponent: () =>
      import('@/views/document-intelligence/document-intelligence.component').then(
        c => c.DocumentIntelligenceComponent
      ),
    canActivate: [PermissionGuard.canActivate],

    data: { permissions: ['DOCUMENT_INTELLIGENCE'], hasAnyPermission: false } as PermissionRouteData,
  },
  {
    path: 'interactive-chatbot',
    loadComponent: () =>
      import('@/views/interactive-chat/interactive-chat.component').then(c => c.InteractiveChatComponent),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: ['CHATBOT'], hasAnyPermission: false } as PermissionRouteData,
  },
  {
    path: 'web-crawler',
    loadComponent: () =>
      import('@/views/web-crawler-report/web-crawler-report.component').then(c => c.WebCrawlerReportComponent),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: ['SEARCH'], hasAnyPermission: false } as PermissionRouteData,
  },
  {
    path: 'admin',
    loadChildren: () => import('@/routes/admin.routes'),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: ['ADMIN'], hasAnyPermission: true } as PermissionRouteData,
  },
  {
    path: '**',
    redirectTo: '',
  },
]

export default routes
