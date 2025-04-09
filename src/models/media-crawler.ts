export class MediaCrawler {
  settings: CrawlerSettings
  urls: CrawlerUrl[]

  constructor() {
    this.settings = new CrawlerSettings()
    this.urls = []
  }
}
export class CrawlerSettings {
  deep: boolean
  selectors: string[]
  mediaCrawling: boolean
  topics?: string[]
  containerName: string
  schedule_by_days: number

  constructor(mediaCrawling = false) {
    this.deep = false
    this.selectors = []
    this.mediaCrawling = mediaCrawling
    this.topics = []
    this.containerName = 'rera-storage'
    this.schedule_by_days = 0
  }
}

export class CrawlerUrl {
  link: string
  headers?: Record<string, string>
  cookies?: Record<string, string>
  payload?: Record<string, string>
  settings: CrawlerSettings

  constructor(link = '', topics: string[] = [], mediaCrawling = false) {
    this.link = link
    this.headers = {}
    this.cookies = {}
    this.payload = {}
    this.settings = new CrawlerSettings(mediaCrawling)
    this.settings.topics = topics
  }
}
