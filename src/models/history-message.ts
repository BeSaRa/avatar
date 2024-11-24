import { BaseMessage } from './base-message'

export class HistoryMessage extends BaseMessage {
  partitionKey!: string
  rowKey!: string
  constructor() {
    super()
  }
}
