import { SentimentType } from '@/types/sentiment-type'

export interface ConversationResultContract {
  partitionKey: string
  rowKey: string
  user_id: string
  conversation_id: string
  feedback: number
  sentiment: SentimentType
  bot_name: string
}
