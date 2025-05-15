import { FaqListComponent } from '@/components/faq-list/faq-list.component'
import { SocialMediaCrawlingComponent } from '@/components/social-media-crawling/social-media-crawling.component'
import { UsersComponent } from '@/components/users/users.component'
import { PermissionRouteData } from '@/contracts/permission-rout-data'
import { PermissionGuard } from '@/guards/permission.guard'
import { AdminCrawlerComponent } from '@/views/admin-crawler/admin-crawler.component'
import { AdminIndexerComponent } from '@/views/admin-indexer/admin-indexer.component'
import { AdminStorageComponent } from '@/views/admin-storage/admin-storage.component'
import AdminComponent from '@/views/admin/admin.component'
import { Routes } from '@angular/router'
import { PERMISSION_GROUPS } from '../resources/all-permissions'

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
  },
  {
    path: 'storage',
    component: AdminStorageComponent,
    canActivate: [PermissionGuard.canActivate],
    data: {
      permissions: PERMISSION_GROUPS['STORAGE_GROUP'],
      hasAnyPermission: true,
    } as PermissionRouteData,
  },
  {
    path: 'rera-legal-storage',
    component: AdminStorageComponent,
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: PERMISSION_GROUPS['LEGAL_GROUP'], hasAnyPermission: true } as PermissionRouteData,
  },
  {
    path: 'indexer',
    component: AdminIndexerComponent,
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: PERMISSION_GROUPS['INDEXES_GROUP'], hasAnyPermission: true } as PermissionRouteData,
  },
  {
    path: 'crawler',
    component: AdminCrawlerComponent,
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: PERMISSION_GROUPS['WEB_CRAWLING_GROUP'], hasAnyPermission: true } as PermissionRouteData,
  },

  {
    path: 'users',
    component: UsersComponent,
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: PERMISSION_GROUPS['USER_GROUP'], hasAnyPermission: true } as PermissionRouteData,
  },
  {
    path: 'faq',
    component: FaqListComponent,
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: PERMISSION_GROUPS['FAQ_GROUP'], hasAnyPermission: true } as PermissionRouteData,
  },
  {
    path: 'social-media',
    component: SocialMediaCrawlingComponent,
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: PERMISSION_GROUPS['SOCIAL_GROUP'], hasAnyPermission: true } as PermissionRouteData,
  },
  {
    path: '**',
    redirectTo: '',
  },
]

export default routes
