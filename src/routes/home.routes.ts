import { PermissionRouteData } from '@/contracts/permission-rout-data'
import { closeStreamGuard } from '@/guards/close-stream.guard'
import { PermissionGuard } from '@/guards/permission.guard'
import { LandingComponent } from '@/views/landing/landing.component'
import { Routes } from '@angular/router'
import { PERMISSION_GROUPS } from '../resources/all-permissions'

const routes: Routes = [
  { path: '', component: LandingComponent },

  {
    path: 'video-indexer',
    loadComponent: () => import('@/views/video-indexer/video-indexer.component').then(c => c.VideoIndexerComponent),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: PERMISSION_GROUPS['VIDEO_INDEXER_GROUP'], hasAnyPermission: true } as PermissionRouteData,
  },
  {
    path: 'search',
    loadComponent: () => import('@/views/ai-search/ai-search.component').then(c => c.AiSearchComponent),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: PERMISSION_GROUPS['SEARCH_GROUP'], hasAnyPermission: true } as PermissionRouteData,
  },
  {
    path: 'chat-history',
    loadComponent: () => import('@/views/chat-history/chat-history.component').then(c => c.ChatHistoryComponent),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: PERMISSION_GROUPS['CHAT_HISTORY_GROUP'], hasAnyPermission: true } as PermissionRouteData,
  },
  {
    path: 'doc-intelligence',
    loadComponent: () =>
      import('@/views/document-intelligence/document-intelligence.component').then(
        c => c.DocumentIntelligenceComponent
      ),
    canActivate: [PermissionGuard.canActivate],

    data: { permissions: PERMISSION_GROUPS['DOCUMENT_ANALYSER_GROUP'], hasAnyPermission: true } as PermissionRouteData,
  },
  {
    path: 'interactive-chatbot',
    loadComponent: () =>
      import('@/views/interactive-chat/interactive-chat.component').then(c => c.InteractiveChatComponent),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: PERMISSION_GROUPS['HR_AGENT_GROUP'], hasAnyPermission: true } as PermissionRouteData,
  },
  {
    path: 'tasks-agent',
    loadComponent: () => import('@/views/agent-chat/agent-chat.component').then(c => c.AgentChatComponent),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: PERMISSION_GROUPS['TASK_AGENT_GROUP'], hasAnyPermission: true } as PermissionRouteData,
  },
  {
    path: 'web-crawler',
    loadComponent: () =>
      import('@/views/web-crawler-report/web-crawler-report.component').then(c => c.WebCrawlerReportComponent),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: PERMISSION_GROUPS['WEB_CRAWLING_GROUP'], hasAnyPermission: true } as PermissionRouteData,
  },
  {
    path: 'statistics',
    loadComponent: () => import('@/views/statistics/statistics.component').then(c => c.StatisticsComponent),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: PERMISSION_GROUPS['STATISTICS_GROUP'], hasAnyPermission: true } as PermissionRouteData,
  },
  {
    path: 'admin',
    loadChildren: () => import('@/routes/admin.routes'),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: PERMISSION_GROUPS['ADMIN_GROUP'], hasAnyPermission: true } as PermissionRouteData,
  },
  {
    path: 'video_analyzer',
    loadComponent: () => import('@/views/video-analyzer/video-analyzer.component').then(c => c.VideoAnalyzerComponent),
    data: { permissions: PERMISSION_GROUPS['VIDEO_INDEXER_GROUP'], hasAnyPermission: true } as PermissionRouteData,
  },
  {
    path: 'avatar',
    loadComponent: () => import('@/views/temp-avatar/temp-avatar.component'),
    pathMatch: 'full',
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: ['AVATAR'], hasAnyPermission: false } as PermissionRouteData,
    canDeactivate: [closeStreamGuard],
  },
  {
    path: 'control',
    loadComponent: () => import('@/views/control/control.component'),
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
]

export default routes
