import { MenuItem } from '@/contracts/menu-item-contract'

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    label: 'home',
    route: '/home',
    svg: 'HOME',
    permissions: ['ADMIN'],
  },
  {
    id: 2,
    label: 'admin_services',
    route: '/home/admin',
    svg: 'SUIT_CASE',
    permissions: ['ADMIN'],
  },
  {
    id: 3,
    label: 'search',
    route: '/home/search',
    svg: 'SEARCH',
    permissions: ['SEARCH'],
  },
  {
    id: 4,
    label: 'avatar_chat',
    route: '/avatar',
    svg: 'AVATAR',
    permissions: ['AVATAR'],
  },
  {
    id: 5,
    label: 'video_indexer',
    route: '/home/video-indexer',
    svg: 'VIDEO',
    permissions: ['MEDIA'],
  },
  {
    id: 6,
    label: 'chat_history',
    route: '/home/chat-history',
    svg: 'CHAT',
    permissions: ['CHATBOT'],
  },
  {
    id: 7,
    label: 'doc_analyzer',
    route: '/home/doc-intelligence',
    svg: 'DOCUMENT',
    permissions: ['DOCUMENT_INTELLIGENCE'],
  },
  {
    id: 8,
    label: 'interactive_chatbot',
    route: '/home/interactive-chatbot',
    svg: 'BOT_ARM',
    permissions: ['SPEECH'],
  },
  {
    id: 9,
    label: 'web_crawler',
    route: '/home/web-crawler',
    svg: 'WEB_CRAWLER',
    permissions: ['SEARCH'],
  },
]
