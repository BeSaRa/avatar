import { ConversationResultContract } from '@/contracts/conversation-result-contract'

export type ChatFilterType = keyof Pick<ConversationResultContract, 'bot_name' | 'feedback' | 'sentiment'>
