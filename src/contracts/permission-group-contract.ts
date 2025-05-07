import { Permission } from './permission-contract'

export interface PermissionGroupContract {
  PartitionKey: string
  RowKey: string
  key: string
  en_name: string
  ar_name: string
  _id: string
  children: Permission[]
}
