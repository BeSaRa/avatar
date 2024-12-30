export class MediaCrawler {
  settings: CrawlerSettings
  urls: CrawlerUrl[]

  constructor() {
    this.settings = new CrawlerSettings()
    this.urls = []
  }
}
class CrawlerSettings {
  deep: boolean
  selectors: string[]
  mediaCrawling: boolean
  topics: string[]
  containerName: string

  constructor(mediaCrawling = false) {
    this.deep = false
    this.selectors = []
    this.mediaCrawling = mediaCrawling
    this.topics = []
    this.containerName = 'rera-storage'
  }
}

export class CrawlerUrl {
  link: string
  headers?: Record<string, string>
  cookies?: Record<string, string>
  payload?: Record<string, unknown>
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
