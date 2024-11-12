import { SearchQueryContract } from '@/contracts/search-query-contract'

export const DEFAULT_SEARCH_QUERY: SearchQueryContract = {
  facet: '',
  page_number: 1,
  page_size: 10,
  query: 'زواج',
  sort: 'date',
}
