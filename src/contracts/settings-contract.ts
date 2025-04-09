import { MediaCrawler } from '@/models/media-crawler'
import { SocialMeidaSearchItem } from '@/types/social-media-search-type'

export interface SettingsContract {
  PartitionKey: string
  RowKey: string
  entity_name: string
  chatbots: ChatbotSetting[]
  dict_AR: Record<string, string>
  media_settings: MediaSettings
  access_token_valid_time: number
  refresh_token_valid_time: number
}

export interface ChatbotSetting {
  name: string
  index_name: string
  custom_settings: CustomSettings
  greeting_message: {
    ar: string
    en: string
  }
  system_message: string
}

export interface CustomSettings {
  temperature: number
}

export interface MediaSettings {
  info: MediaSettingInfo
  web_urls: string[]
  a_class: string[]
  p_class: string[]
  img_class: string[]
  x_crawling: Partial<Omit<SocialMeidaSearchItem, 'id'>>[]
  crawling_urls: CrawlUrlContract[]
}

export interface MediaSettingInfo {
  index_name: string
  reports_container_name: string
  container_name: string
}

export interface CrawlUrlContract {
  last_crawl: string
  crawl_days: number
  crawling_status: 'Success' | 'Error' | '' | 'InProgress'
  crawl_settings: MediaCrawler
}
