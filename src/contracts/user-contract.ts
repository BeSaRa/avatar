export interface User {
  PartitionKey: string
  RowKey: string
  _id: string
  username: string
  never_expire: boolean
}
