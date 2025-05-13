import { NavCardComponent } from '@/components/nav-card/nav-card.component'
import { SVG_ICONS } from '@/constants/svg-icons'
import { LangKeysContract } from '@/contracts/lang-keys-contract'
import { LocalService } from '@/services/local.service'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavCardComponent],
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
    color: any
  }[] = [
    { title: 'storage', desc: 'storage_desc', link: './storage', icon: 'STORAGE', color: 'primary' },
    {
      title: 'legal_document_management',
      desc: 'legal_document_desc',
      link: './rera-legal-storage',
      icon: 'LEGAL',
      color: 'primary-outline',
    },
    { title: 'indexers', desc: 'indexers_desc', link: './indexer', icon: 'INDEXER', color: 'accent' },
    { title: 'users', desc: 'users_desc', link: './users', icon: 'USERS', color: 'accent-outline' },
    { title: 'web_crawler', desc: 'web_crawling_desc', link: './crawler', icon: 'WEB_CRAWLER', color: 'secondary' },
    { title: 'faq_manager', desc: 'faq_manager_desc', link: './faq', icon: 'FAQ', color: 'secondary-outline' },
    {
      title: 'social_media_crawling',
      desc: 'social_media_crawling_desc',
      link: './social-media',
      icon: 'MEDIA_CRAWLER',
      color: 'tertiary',
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
