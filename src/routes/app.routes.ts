import { Routes } from '@angular/router'
import { closeStreamGuard } from '@/guards/close-stream.guard'

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('@/views/home/home.component'),
    loadChildren: () => import('@/routes/home.routes'),
  },
  {
    path: 'avatar',
    loadComponent: () => import('@/views/avatar/avatar.component'),
    pathMatch: 'full',
    canDeactivate: [closeStreamGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
]
