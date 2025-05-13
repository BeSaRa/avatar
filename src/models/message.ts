import { ClonerMixin } from '@/mixins/cloner-mixin'
import { BaseMessage } from './base-message'
import { MessageRoleType } from '@/types/message-role-type'
import { ToolCallContract } from '@/contracts/tool-call-contract'

export class Message extends ClonerMixin(BaseMessage) {
  end_turn!: boolean
  function_call!: unknown
  tool_calls?: ToolCallContract[]

  constructor(
    public override content = '',
    public override role: MessageRoleType = 'user',
    public chatType: string | undefined = undefined
  ) {
    super()
  }
}
