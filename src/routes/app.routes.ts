import { PermissionRouteData } from '@/contracts/permission-rout-data'
import { AuthGuard } from '@/guards/auth.guard'
import { closeStreamGuard } from '@/guards/close-stream.guard'
import { PermissionGuard } from '@/guards/permission.guard'
import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('@/views/home/home.component'),
    loadChildren: () => import('@/routes/home.routes'),
    canActivate: [AuthGuard],
  },
  {
    path: 'avatar',
    loadComponent: () => import('@/views/avatar/avatar.component'),
    pathMatch: 'full',
    canActivate: [AuthGuard, PermissionGuard.canActivate],
    data: { permissions: ['AVATAR'], hasAnyPermission: false } as PermissionRouteData,
    canDeactivate: [closeStreamGuard],
  },

  {
    path: 'auth',
    loadComponent: () => import('@/views/auth/auth/auth.component'),
    loadChildren: () => import('@/routes/auth.routes'),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
]
