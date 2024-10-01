import { Routes } from '@angular/router'

export const routes: Routes = [
  { path: '', loadComponent: () => import('@/views/avatar/avatar.component'), pathMatch: 'full' },
]
