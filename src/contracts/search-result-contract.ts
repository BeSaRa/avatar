export interface SearchResultContract {
  '@search.captions': unknown
  '@search.highlights': Highlight | null
  '@search.reranker_score': number
  '@search.score': number
  chunk: string
  chunk_id: string
  keywords: string[]
  metadata_storage_path: string
  parent_id: string
  text_vector: number[]
  title: string
  ref_url: string
  website_url: string
}

export interface Highlight {
  merged_content: string[]
  imageCaption: string[]
}
