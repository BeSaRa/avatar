import { HttpContextToken } from '@angular/common/http'

export const NO_ACCESS_TOKEN = new HttpContextToken<boolean>(() => false)
