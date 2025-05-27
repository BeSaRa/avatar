import { SVG_ICONS } from '@/constants/svg-icons'
import { LangKeysContract } from './lang-keys-contract'
import { ALL_PERMISSIONS } from '../resources/all-permissions'
import { CardColor } from '@/constants/card-color-type'

export interface MenuItem {
  id: number
  label: keyof LangKeysContract
  desc?: keyof LangKeysContract
  color?: CardColor
  svg: keyof typeof SVG_ICONS
  imgUrl?: string
  route: string
  permissions: (keyof typeof ALL_PERMISSIONS)[]
  haveSomeOfPermissions?: boolean
  children?: MenuItem[]
}
