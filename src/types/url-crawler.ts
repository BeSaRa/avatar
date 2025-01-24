import { URL_PATTERN } from '@/constants/url-pattern'
import { CrawlerUrl, MediaCrawler } from '@/models/media-crawler'
import { inject } from '@angular/core'
import { NonNullableFormBuilder, Validators } from '@angular/forms'

// Exported function to create the URL form group
export function createUrlGroup() {
  const fb = inject(NonNullableFormBuilder)

  return fb.group({
    link: fb.control('', [Validators.required, Validators.pattern(URL_PATTERN)]),
    headers: fb.array<{ key: string; value: string }>([]),
    cookies: fb.array<{ key: string; value: string }>([]),
    payload: fb.array<{ key: string; value: string }>([]),
    settings: createSettingsGroup(),
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
  })
}

export function createCrawlerGroup() {
  const fb = inject(NonNullableFormBuilder)

  return fb.group({
    urls: fb.array<UrlGroup>([]),
    settings: createSettingsGroup(),
  })
}

export type UrlGroup = ReturnType<typeof createUrlGroup>
export type SettingGroup = ReturnType<typeof createSettingsGroup>
export type CrawlerGroup = ReturnType<typeof createCrawlerGroup>
// Extracting the type using the `getRawValue` method
export type UrlGroupRawValue = ReturnType<UrlGroup['getRawValue']>
export type SettingsGroupRawValue = ReturnType<SettingGroup['getRawValue']>
export type CrawlerGroupRawValue = ReturnType<CrawlerGroup['getRawValue']>
export type TransformedGrouped = { urls: UrlGroupRawValue[]; settings: SettingsGroupRawValue } | UrlGroupRawValue
export type TransformedData<TData extends TransformedGrouped> = TData extends UrlGroupRawValue
  ? CrawlerUrl
  : MediaCrawler
