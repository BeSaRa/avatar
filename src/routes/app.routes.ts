import { AuthGuard } from '@/guards/auth.guard'
import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('@/views/home/home.component'),
    loadChildren: () => import('@/routes/home.routes'),
    canActivate: [AuthGuard],
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
