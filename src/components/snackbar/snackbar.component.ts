import { SnackBarDataContract } from '@/contracts/snack-bar-data-contract'
import { Component, inject } from '@angular/core'
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar'

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent {
  snackbarRef = inject<MatSnackBarRef<SnackbarComponent>>(MatSnackBarRef)
  snackbarData = inject<SnackBarDataContract>(MAT_SNACK_BAR_DATA)
}
