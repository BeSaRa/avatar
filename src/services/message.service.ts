import { SnackbarComponent } from '@/components/snackbar/snackbar.component'
import { SnackBarDataContract } from '@/contracts/snack-bar-data-contract'
import { inject, Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private _snackBar = inject(MatSnackBar)

  showError(error: string, title?: string) {
    this._snackBar.openFromComponent<SnackbarComponent, SnackBarDataContract>(SnackbarComponent, {
      data: {
        title,
        message: error,
        status: 'error',
      },
      panelClass: ['bg-primary', 'rounded-lg'],
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
    })
  }

  showInfo(message: string, title?: string) {
    this._snackBar.openFromComponent<SnackbarComponent, SnackBarDataContract>(SnackbarComponent, {
      data: {
        title,
        message,
        status: 'success',
      },
      panelClass: ['bg-accent-700', 'rounded-lg'],
    })
  }
}
