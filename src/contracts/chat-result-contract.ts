import { ConversationResultContract } from './conversation-result-contract'

export interface ChatResultContract
  extends Pick<ConversationResultContract, 'partitionKey' | 'rowKey' | 'conversation_id'> {
  content: string
  context: string
  role: 'user' | 'assistant'
}
