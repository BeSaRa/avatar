import { ClonerMixin } from '@/mixins/cloner-mixin'
import { MessageRoleType } from '@/types/message-role-type'
import { Message } from './message'

export const metaCols = ['PartitionKey', 'RowKey']

export class AgentMessage extends ClonerMixin(Message) {
  isAnimating = false

  constructor(
    content = '',
    role: MessageRoleType = 'user',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public list: Record<string, any>[] | null = null
  ) {
    super(content, role)
  }

  hasTable() {
    return this.list && this.list.length && Object.keys(this.list[0]).filter(c => !(c in metaCols)).length
  }

  hasTaskId() {
    return this.list && this.list.length && Object.keys(this.list[0]).includes('task_id')
  }

  getCols() {
    return this.list && this.list.length ? Object.keys(this.list[0]).filter(k => !metaCols.includes(k)) : []
  }
}
