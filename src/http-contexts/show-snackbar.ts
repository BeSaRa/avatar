import { HttpContextToken } from '@angular/common/http'

export const SHOW_SNACKBAR = new HttpContextToken<boolean>(() => false)
