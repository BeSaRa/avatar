import { ChatMessageResultContract } from './chat-message-result-contract'

export interface ChatActionResultContract<TActionResult = unknown> {
  status_code: number
  status: string
  message: string
  data: Data<TActionResult>
}

export interface Data<TActionResult> {
  action_results: TActionResult
  final_message: ChatMessageResultContract
}
