import { ClonerMixin } from '@/mixins/cloner-mixin'
import { MessageRoleType } from '@/types/message-role-type'
import { generateUUID } from '@/utils/utils'

export class Message extends ClonerMixin(class {}) {
  context!: IContext
  end_turn!: boolean
  function_call!: unknown
  tool_calls!: unknown
  id?: string

  constructor(
    public content = '',
    public role: MessageRoleType = 'user'
  ) {
    super()
    this.id = generateUUID()
  }
}

interface IContext {
  citations: ICitations[]
  intent: string
}

export interface ICitations {
  filepath: string
  content: string
  url: string
}
