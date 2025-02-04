import { UsersComponent } from '@/components/users/users.component'
import { PermissionRouteData } from '@/contracts/permission-rout-data'
import { PermissionGuard } from '@/guards/permission.guard'
import { AdminCrawlerComponent } from '@/views/admin-crawler/admin-crawler.component'
import { AdminIndexerComponent } from '@/views/admin-indexer/admin-indexer.component'
import { AdminStorageComponent } from '@/views/admin-storage/admin-storage.component'
import AdminComponent from '@/views/admin/admin.component'
import { Routes } from '@angular/router'

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
  },
  {
    path: 'storage',
    component: AdminStorageComponent,
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: ['ADMIN'], hasAnyPermission: false } as PermissionRouteData,
  },
  {
    path: 'indexer',
    component: AdminIndexerComponent,
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: ['ADMIN'], hasAnyPermission: false } as PermissionRouteData,
  },
  {
    path: 'crawler',
    component: AdminCrawlerComponent,
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: ['ADMIN'], hasAnyPermission: false } as PermissionRouteData,
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: ['ADMIN'], hasAnyPermission: false } as PermissionRouteData,
  },
  {
    path: '**',
    redirectTo: '',
  },
]

export default routes
