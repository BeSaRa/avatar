import { SVG_ICONS } from '@/constants/svg-icons'
import { LangKeysContract } from './lang-keys-contract'
import { ALL_PERMISSIONS } from '../resources/all-permissions'

export interface MenuItem {
  id: number
  label: keyof LangKeysContract
  svg: keyof typeof SVG_ICONS
  route: string
  permissions: readonly (keyof typeof ALL_PERMISSIONS)[]
  haveSomeOfPermissions?: boolean
}
