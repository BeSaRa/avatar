export interface UploadProgressContract {
  progress: number
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE'
}
