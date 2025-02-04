import { ALL_PERMISSIONS } from '../resources/all-permissions'

export interface PermissionRouteData {
  permissions: (keyof typeof ALL_PERMISSIONS)[]
  hasAnyPermission: boolean
}
