import { inject, Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private _snackBar = inject(MatSnackBar)

  showError(error: string, action?: string) {
    this._snackBar.open(error, action)
  }

  showInfo(msg: string, action?: string) {
    this._snackBar.open(msg, action)
  }
}
