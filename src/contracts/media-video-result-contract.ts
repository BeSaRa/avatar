export interface MediaVideoResultContract<TData> {
  status_code?: number
  status: string
  message: string
  data: TData
}

export interface VideoData {
  name: string
  id: string
  thumbnail_url: string
}

export interface VideoIndexInfo {
  conversation_id: string
  bot_name: string
}
