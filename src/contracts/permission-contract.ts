export interface Permission {
  PartitionKey: string
  RowKey: string
  key: string
  en_name: string
  ar_name: string
  _id: string
  url: string
  is_general: boolean
  children: Permission[]
}
