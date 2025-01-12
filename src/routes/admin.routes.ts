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
  },
  {
    path: 'indexer',
    component: AdminIndexerComponent,
  },
  {
    path: 'crawler',
    component: AdminCrawlerComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
]

export default routes
