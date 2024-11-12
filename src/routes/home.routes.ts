import { Routes } from '@angular/router'
import { LandingComponent } from '@/views/landing/landing.component'

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'video-indexer',
    loadComponent: () => import('@/views/video-indexer/video-indexer.component').then(c => c.VideoIndexerComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('@/views/ai-search/ai-search.component').then(c => c.AiSearchComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
]

export default routes
