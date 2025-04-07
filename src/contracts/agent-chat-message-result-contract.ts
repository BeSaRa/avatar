import { MessageRoleType } from '@/types/message-role-type'

export interface AgentChatMessageResultContract {
  ai_model_id: string
  metadata: {
    // logprobs: null
    id: string
    created: number
    system_fingerprint: string
    usage: {
      prompt_tokens: number
      completion_tokens: number
    }
  }
  content_type: string
  role: MessageRoleType
  name: null | string
  items: [
    {
      // ai_model_id: null
      // metadata: {}
      content_type: string
      text: string
      // encoding: null
    },
  ]
  // encoding: null
  // finish_reason: 'stop'
  conversation_id: '5a9f3319-e564-4abd-9a3a-d205cd1cefc7'
  action_results: null | Record<string, unknown>[]
}
