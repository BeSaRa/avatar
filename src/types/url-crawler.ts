import { URL_PATTERN } from '@/constants/url-pattern'
import { CrawlUrlContract } from '@/contracts/settings-contract'
import { CrawlerUrl } from '@/models/media-crawler'
import { inject } from '@angular/core'
import { NonNullableFormBuilder, Validators } from '@angular/forms'

// Exported function to create the URL form group
export function createUrlGroup() {
  const fb = inject(NonNullableFormBuilder)

  return fb.group({
    link: fb.control({ value: '', disabled: true }, [Validators.required, Validators.pattern(URL_PATTERN)]),
    headers: fb.array<KeyValuePairGroup>([]),
    cookies: fb.array<KeyValuePairGroup>([]),
    payload: fb.array<KeyValuePairGroup>([]),
    settings: createSettingsGroup(),
  })
}

export function createKeyValuePair() {
  const fb = inject(NonNullableFormBuilder)

  return fb.group({
    key: fb.control(''),
    value: fb.control(''),
  })
}

// Exported function to create the settings form group
export function createSettingsGroup() {
  const fb = inject(NonNullableFormBuilder)

  return fb.group({
    deep: fb.control(false),
    selectors: fb.control<string[]>([]),
    topics: fb.control<string[]>([]),
    mediaCrawling: fb.control(false),
    containerName: fb.control('rera-storage', [Validators.required]),
    schedule_by_days: fb.control(1, [Validators.required, Validators.min(1)]),
  })
}

export function createCrawlerGroup() {
  const fb = inject(NonNullableFormBuilder)

  return fb.group({
    urls: fb.array<UrlGroup>([]),
    settings: createSettingsGroup(),
  })
}

export function createCrawlerSettingsGroup(url?: CrawlUrlContract) {
  const fb = inject(NonNullableFormBuilder)

  return fb.group({
    last_crawl: fb.control(url?.last_crawl ?? new Date().toISOString().split('T')[0]),
    crawl_days: fb.control(url?.crawl_days, Validators.min(1)),
    crawling_status: fb.control(url?.crawling_status ?? ''),
    crawl_settings: createCrawlerGroup(),
  })
}

export type UrlGroup = ReturnType<typeof createUrlGroup>
export type SettingGroup = ReturnType<typeof createSettingsGroup>
export type CrawlerGroup = ReturnType<typeof createCrawlerGroup>
export type CrawlerSettingGroup = ReturnType<typeof createCrawlerSettingsGroup>
export type KeyValuePairGroup = ReturnType<typeof createKeyValuePair>
// Extracting the type using the `getRawValue` method
export type UrlGroupRawValue = ReturnType<UrlGroup['getRawValue']>
export type SettingsGroupRawValue = ReturnType<SettingGroup['getRawValue']>
export type CrawlerGroupRawValue = ReturnType<CrawlerGroup['getRawValue']>
export type CrawlerSettingsGroupRawValue = ReturnType<CrawlerSettingGroup['getRawValue']>
export type TransformedGrouped = CrawlerSettingsGroupRawValue[] | UrlGroupRawValue
export type TransformedData<TData extends TransformedGrouped> = TData extends UrlGroupRawValue
  ? CrawlerUrl
  : CrawlUrlContract[]
