export interface MostIndexedUrlsContract {
  PartitionKey: string
  RowKey: string
  Most_indexed_URL: string
  Count: number
  IndexDate: string
}

export interface MostUsedKeywordsContract {
  PartitionKey: string
  RowKey: string
  'Most-used-keywords': string
  Count: number
  IndexDate: string
}

export interface NewsPercentageContract {
  internal: number
  external: number
  social: number
}
