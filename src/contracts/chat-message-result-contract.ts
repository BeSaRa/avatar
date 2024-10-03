import { Message } from '@/models/message'

export interface ChatMessageResultContract {
  finish_reason: 'stop'
  index: number
  logprobs: unknown
  message: Message
  error: boolean
}
