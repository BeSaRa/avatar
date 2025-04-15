import { Routes } from '@angular/router'
import { closeStreamGuard } from '@/guards/close-stream.guard'
import { AuthGuard } from '@/guards/auth.guard'
import { PermissionGuard } from '@/guards/permission.guard'
import { PermissionRouteData } from '@/contracts/permission-rout-data'

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
    path: 'ms-avatar',
    loadComponent: () => import('@/views/ms-avatar/ms-avatar.component'),
    pathMatch: 'full',
    canActivate: [AuthGuard, PermissionGuard.canActivate],
    data: { permissions: ['AVATAR'], hasAnyPermission: false } as PermissionRouteData,
    canDeactivate: [closeStreamGuard],
  },
  {
    path: 'video-generator',
    loadComponent: () => import('@/views/video-generator/video-generator.component'),
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
    path: 'control',
    loadComponent: () => import('@/views/control/control.component'),
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
]
