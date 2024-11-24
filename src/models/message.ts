import { ClonerMixin } from '@/mixins/cloner-mixin'
import { BaseMessage } from './base-message'
import { MessageRoleType } from '@/types/message-role-type'

export class Message extends ClonerMixin(BaseMessage) {
  end_turn!: boolean
  function_call!: unknown
  tool_calls!: unknown

  constructor(
    public override content = '',
    public override role: MessageRoleType = 'user'
  ) {
    super()
  }
}
