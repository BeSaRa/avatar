export interface ConversationResultContract {
  partitionKey: string
  rowKey: string
  user_id: string
  conversation_id: string
  feedback: number
  sentiment: 'negative' | 'mixed' | 'positive' | 'neutral'
  bot_name: string
}
