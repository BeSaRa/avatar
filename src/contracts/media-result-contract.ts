export interface MediaResultContract<TData = null> {
  status_code: number
  status: string
  message: string
  data: TData | null
}
