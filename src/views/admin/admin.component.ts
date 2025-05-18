import { NavCardComponent } from '@/components/nav-card/nav-card.component'
import { SVG_ICONS } from '@/constants/svg-icons'
import { LangKeysContract } from '@/contracts/lang-keys-contract'
import { LocalService } from '@/services/local.service'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ALL_PERMISSIONS } from '../../resources/all-permissions'
import { HasPermissionDirective } from '@/directives/has-permission.directive'
import { CardColor } from '@/constants/card-color-type'

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavCardComponent, HasPermissionDirective],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export default class AdminComponent {
  lang = inject(LocalService)

  pages: {
    title: keyof LangKeysContract
    desc: keyof LangKeysContract
    link: string
    icon: keyof typeof SVG_ICONS
    color: CardColor
    permissions: (keyof typeof ALL_PERMISSIONS)[]
  }[] = [
    {
      title: 'storage',
      desc: 'storage_desc',
      link: './storage',
      icon: 'STORAGE',
      color: 'primary',
      permissions: ['STORAGE_GET_ALL_CONTAINERS'],
    },
    {
      title: 'legal_document_management',
      desc: 'legal_document_desc',
      link: './rera-legal-storage',
      icon: 'LEGAL',
      color: 'primary-outline',
      permissions: ['ADMIN_GET_LEGAL_CONTAINER'],
    },
    {
      title: 'indexers',
      desc: 'indexers_desc',
      link: './indexer',
      icon: 'INDEXER',
      color: 'accent',
      permissions: ['INDEXES_NAMES'],
    },
    {
      title: 'users',
      desc: 'users_desc',
      link: './users',
      icon: 'USERS',
      color: 'accent-outline',
      permissions: ['ADMIN_GET_ALL_USER'],
    },
    {
      title: 'web_crawler',
      desc: 'web_crawling_desc',
      link: './crawler',
      icon: 'WEB_CRAWLER',
      color: 'secondary',
      permissions: ['MEDIA_CRAWL'],
    },
    {
      title: 'faq_manager',
      desc: 'faq_manager_desc',
      link: './faq',
      icon: 'FAQ',
      color: 'secondary-outline',
      permissions: ['FAQ_GET_ALL_QUESTIONS'],
    },
    {
      title: 'social_media_crawling',
      desc: 'social_media_crawling_desc',
      link: './social-media',
      icon: 'MEDIA_CRAWLER',
      color: 'tertiary',
      permissions: ['SOCIAL_MEDIA'],
    },
  ]

  getIndices() {
    const _indices: number[] = []
    for (let i = 0; i <= this.pages.length; i++) {
      if (i % 2 === 0) _indices.push(i)
    }
    return _indices
  }

  isVertical(idx: number) {
    return (idx - 2) % 8 < 4 && (idx - 2) % 8 >= 0 ? false : true
  }
}
