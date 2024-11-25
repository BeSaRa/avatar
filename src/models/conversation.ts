import { FeedbackChat } from '@/enums/feedback-chat'
import { SentimentType } from '@/types/sentiment-type'

export class Conversation {
  partitionKey!: string
  rowKey!: string
  user_id!: string
  conversation_id!: string
  feedback!: FeedbackChat
  sentiment!: SentimentType
  bot_name!: string
  title!: string
  timestamp!: string | Date

  getEmojiPerSetiment() {
    switch (this.sentiment) {
      case 'negative':
        return '😟'
      case 'mixed':
        return '😕'
      case 'positive':
        return '😊'
      case 'neutral':
        return '😐'
      default:
        return '❓'
    }
  }
}
