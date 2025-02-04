import { Permission } from '@/contracts/permission-contract'
import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { LocalService } from '@/services/local.service'
import { PermissionsService } from '@/services/permissions.service'
import { NgClass } from '@angular/common'
import { Component, signal, inject, OnInit } from '@angular/core'
import { FormArray, FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { finalize, iif, of, switchMap, tap } from 'rxjs'
import { CheckboxComponent } from '../checkbox/checkbox.component'

@Component({
  selector: 'app-permissions-popup',
  standalone: true,
  imports: [ReactiveFormsModule, PerfectScrollDirective, MatDialogModule, NgClass, CheckboxComponent],
  templateUrl: './permissions-popup.component.html',
  styleUrl: './permissions-popup.component.scss',
})
export class PermissionsPopupComponent implements OnInit {
  permissionsService = inject(PermissionsService)
  fb = inject(NonNullableFormBuilder)
  lang = inject(LocalService)
  ref = inject<MatDialogRef<PermissionsPopupComponent>>(MatDialogRef)
  data = inject<{ userId: string }>(MAT_DIALOG_DATA)
  permissions = signal<Permission[]>([])
  permissionsForm = this.fb.group({
    permissions: this.fb.array<boolean>([]),
  })
  isLoading = signal(false)

  get permissionsList() {
    return this.permissionsForm.get('permissions') as FormArray<FormControl<boolean>>
  }

  ngOnInit(): void {
    this.getAllPermissions()
  }

  getAllPermissions() {
    this.isLoading.set(true)
    this.permissionsService
      .getAllPermission()
      .pipe(
        switchMap(allPermissions =>
          iif(
            () => !!this.data,
            this.getUserPermission(allPermissions),
            of(allPermissions).pipe(
              tap(allPermissions => {
                this.preparePermissionsForm(allPermissions)
              })
            )
          )
        ),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe()
  }

  preparePermissionsForm(allPermissions: Permission[], userPermissions: Permission[] = []) {
    this.permissions.set(allPermissions)
    this.permissionsList.clear()

    allPermissions.forEach(permission => {
      const isChecked = userPermissions.some(userPerm => userPerm._id === permission._id)
      this.permissionsList.push(this.fb.control(isChecked))
    })
  }

  getUserPermission(allPermissions: Permission[]) {
    return this.permissionsService.getUserPermission(this.data.userId).pipe(
      tap(userPermissions => {
        this.preparePermissionsForm(allPermissions, userPermissions)
      })
    )
  }
  editPermissions() {
    const { userId } = this.data
    const checkedPermssionsIds = this.permissionsList
      .getRawValue()
      .flatMap((checked, i) => (checked ? [this.permissions()[i]._id] : []))
    this.permissionsService
      .updatePermission(userId, checkedPermssionsIds)
      .pipe(finalize(() => this.ref.close()))
      .subscribe()
  }
}
