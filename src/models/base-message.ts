import { MessageRoleType } from '@/types/message-role-type'
import { generateUUID } from '@/utils/utils'

export class BaseMessage {
  context!: IContext
  conversation_id!: string
  content!: string
  role!: MessageRoleType
  id?: string

  /**
   *
   */
  constructor() {
    this.id = generateUUID()
  }
  isUser(): boolean {
    return this.role === 'user'
  }

  isAssistant(): boolean {
    return this.role === 'assistant'
  }

  isError(): boolean {
    return this.role === 'error'
  }
}

interface IContext {
  citations: ICitations[]
  intent: string[]
}

export interface ICitations {
  title: string
  filepath: string
  content: string
  url: string
}
