import { Routes } from '@angular/router'
import { closeStreamGuard } from '@/guards/close-stream.guard'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@/views/avatar/avatar.component'),
    pathMatch: 'full',
    canDeactivate: [closeStreamGuard],
  },
]
