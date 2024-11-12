import { SortType } from '@/types/sort-type'

export interface SearchQueryContract {
  query: string
  facet: string
  sort: SortType
  page_size: number
  page_number: number
}
