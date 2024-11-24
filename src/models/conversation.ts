export class Conversation {
  partitionKey!: string
  rowKey!: string
  user_id!: string
  conversation_id!: string
  feedback?: number
  sentiment?: 'negative' | 'mixed' | 'positive' | 'neutral'
  bot_name!: string

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
