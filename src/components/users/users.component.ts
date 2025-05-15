import { User } from '@/contracts/user-contract'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { LocalService } from '@/services/local.service'
import { UserService } from '@/services/user.service'
import { NgClass } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { takeUntil, tap, catchError, of, finalize, debounceTime, distinctUntilChanged, switchMap } from 'rxjs'
import { AddUserPopupComponent } from '../add-user-popup/add-user-popup.component'
import { PermissionsPopupComponent } from '../permissions-popup/permissions-popup.component'
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component'
import { ConfirmationDialogDataContact } from '@/contracts/confirmation-dialog-data-contract'
import { HasPermissionDirective } from '@/directives/has-permission.directive'

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, HasPermissionDirective],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent extends OnDestroyMixin(class {}) implements OnInit {
  userService = inject(UserService)
  dialog = inject(MatDialog)
  lang = inject(LocalService)
  users = signal<User[]>([])
  filteredUsers = signal<User[]>([])
  loading = signal(false)
  searchControl = new FormControl<string>('', { nonNullable: true })

  ngOnInit(): void {
    this.getAllUsers()
    this.listenToSearch()
  }

  getAllUsers(): void {
    this.loading.set(true)
    this.userService
      .getAllUsers()
      .pipe(
        takeUntil(this.destroy$),
        tap(data => {
          this.users.set(data)
          this.filteredUsers.set(data)
        }),
        catchError(() => {
          return of([])
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe()
  }
  listenToSearch(): void {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(500), distinctUntilChanged())
      .subscribe(searchTerm => {
        this.filteredUsers.update(() =>
          this.users().filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      })
  }

  addUser() {
    this.dialog
      .open<AddUserPopupComponent, undefined, boolean>(AddUserPopupComponent)
      .afterClosed()
      .pipe(tap(() => this.getAllUsers()))
      .subscribe()
  }
  deleteUser(user: User) {
    this.dialog
      .open<ConfirmationPopupComponent, ConfirmationDialogDataContact, boolean>(ConfirmationPopupComponent, {
        data: {
          // eslint-disable-next-line max-len
          htmlContent: `<p class="flex flex-col gap-4 text-center text-xl text-gray-700">${this.lang.locals.delete_message} <span class="italic text-sm text-primary">${user.username}<span> ? </p>`,
        },
      })
      .afterClosed()
      .pipe(
        switchMap(confirmed => {
          if (!confirmed) return of(null)
          return this.userService.deleteUser(user._id).pipe(
            takeUntil(this.destroy$),
            tap(() => this.getAllUsers())
          )
        })
      )
      .subscribe()
  }
  editPermissions(userId: string) {
    this.dialog.open<PermissionsPopupComponent, { userId: string }, void>(PermissionsPopupComponent, {
      data: {
        userId,
      },
    })
  }
}
