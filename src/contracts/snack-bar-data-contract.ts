export interface SnackBarDataContract {
  title?: string
  message: string
  status: 'error' | 'success' | 'info' | 'warning'
}
