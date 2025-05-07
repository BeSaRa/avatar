import { Permission } from '@/contracts/permission-contract'
import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { LocalService } from '@/services/local.service'
import { PermissionsService } from '@/services/permissions.service'
import { NgClass } from '@angular/common'
import { Component, signal, inject, OnInit, runInInjectionContext, Injector } from '@angular/core'
import { FormArray, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { finalize, forkJoin, of, switchMap, tap } from 'rxjs'
import { CheckboxComponent } from '../checkbox/checkbox.component'
import {
  createPermissionForm,
  createPermissionGroup,
  PermissionChildGroup,
  PermissionGroup,
} from '@/types/permission-form-type'
import { PermissionGroupContract } from '@/contracts/permission-group-contract'

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
  permissions = signal<PermissionGroupContract[]>([])
  permissionsForm = createPermissionForm()
  isLoading = signal(false)
  injector = inject(Injector)
  permissionGroups$ = this.permissionsService.getPermissionGroups()
  permissions$ = this.permissionsService.getAllPermission()

  get permissionsList() {
    return this.permissionsForm.get('permissions') as FormArray<PermissionGroup>
  }

  getChildrenList(parentIndex: number) {
    return this.permissionsList.at(parentIndex).get('children') as FormArray<PermissionChildGroup>
  }

  preparePermissionsList(permissions: PermissionGroupContract[]) {
    this.permissionsList.clear()
    permissions.forEach(permission =>
      runInInjectionContext(this.injector, () => this.permissionsList.push(createPermissionGroup(permission)))
    )
  }

  ngOnInit(): void {
    this.getAllPermissions()
  }

  getAllPermissions() {
    this.isLoading.set(true)
    forkJoin([this.permissionGroups$, this.permissions$])
      .pipe(
        switchMap(([permissionGroups, allPermissions]) =>
          this.data
            ? this.getUserPermission(allPermissions, permissionGroups)
            : of(allPermissions).pipe(
                tap(allPermissions => this.preparePermissionsForm(allPermissions, permissionGroups))
              )
        ),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe()
  }

  private preparePermissionsForm(
    allPermissions: Permission[],
    permissionGroups: PermissionGroupContract[],
    userPermissions: Permission[] = []
  ): void {
    this.categorizePermissions(allPermissions, permissionGroups)
    this.permissions.set(permissionGroups)
    this.preparePermissionsList(permissionGroups)

    allPermissions.forEach((permission, parentIndex) => {
      const isChecked = userPermissions.some(userPerm => userPerm._id === permission._id)

      if (isChecked) {
        this.updateGeneralPermission(permission)
      } else {
        this.updateChildPermissions(parentIndex, userPermissions)
      }
    })
  }

  private updateGeneralPermission(userPermission: Permission): void {
    const index = this.permissionsList.controls.findIndex(ctrl => ctrl.value.id === userPermission._id)
    if (index !== -1) {
      this.permissionsList.at(index).get('checked')?.patchValue(true)
      this.getChildrenList(index).controls.forEach(ctrl => ctrl.get('checked')?.patchValue(true))
    }
  }

  private updateChildPermissions(parentIndex: number, userPermissions: Permission[]): void {
    const childrenList = this.getChildrenList(parentIndex)

    let areAllChildrenChecked = !!childrenList.length

    childrenList.controls.forEach(ctrl => {
      const childId = ctrl.value.id
      const isChildChecked = userPermissions.some(userPerm => userPerm._id === childId)

      ctrl.get('checked')?.patchValue(isChildChecked)

      if (!isChildChecked) {
        areAllChildrenChecked = false
      }
    })
    this.permissionsList.at(parentIndex).get('checked')?.patchValue(areAllChildrenChecked)
  }

  categorizePermissions(permissions: Permission[], permissionGroups: PermissionGroupContract[]) {
    permissionGroups.forEach(group => {
      group.children = permissions.filter(permission => permission.group_id === group._id)
    })
  }

  getUserPermission(allPermissions: Permission[], permissionGroups: PermissionGroupContract[]) {
    return this.permissionsService.getUserPermission(this.data.userId).pipe(
      tap(userPermissions => {
        this.preparePermissionsForm(allPermissions, permissionGroups, userPermissions)
      })
    )
  }

  private getCheckedPermissions(): string[] {
    return this.permissionsList
      .getRawValue()
      .flatMap(el => [el.checked ? el.id : null, ...el.children.map(ch => (ch.checked ? ch.id : null))])
      .filter(Boolean) as string[]
  }

  editPermissions(): void {
    const { userId } = this.data
    const checkedPermissionsIds = this.getCheckedPermissions()

    this.permissionsService
      .updatePermission(userId, checkedPermissionsIds)
      .pipe(finalize(() => this.ref.close()))
      .subscribe()
  }

  toggleSelection(isChecked: boolean, parentIndex: number) {
    this.getChildrenList(parentIndex).controls.forEach(ctrl => {
      ctrl.get('checked')?.patchValue(isChecked)
    })
  }
  toggleSelectionChild(parentIndex: number) {
    setTimeout(() => {
      const isAllChecked = this.getChildrenList(parentIndex).controls.every(ctrl => ctrl.get('checked')?.value)
      this.permissionsList.at(parentIndex).get('checked')?.patchValue(isAllChecked)
    })
  }
}
