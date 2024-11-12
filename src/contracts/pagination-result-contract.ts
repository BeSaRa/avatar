export interface PaginationResultContract<M> {
  count: number
  total_count: number
  page_number: number
  rs: M[]
}
