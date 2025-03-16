import { Permission } from '@/contracts/permission-contract'
import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { LocalService } from '@/services/local.service'
import { PermissionsService } from '@/services/permissions.service'
import { NgClass } from '@angular/common'
import { Component, signal, inject, OnInit, runInInjectionContext, Injector } from '@angular/core'
import { FormArray, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { finalize, of, switchMap, tap } from 'rxjs'
import { CheckboxComponent } from '../checkbox/checkbox.component'
import {
  createPermissionForm,
  createPermissionGroup,
  PermissionChildGroup,
  PermissionGroup,
} from '@/types/permission-form-type'

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
  permissionsForm = createPermissionForm()
  isLoading = signal(false)
  injector = inject(Injector)

  get permissionsList() {
    return this.permissionsForm.get('permissions') as FormArray<PermissionGroup>
  }

  getChildrenList(parentIndex: number) {
    return this.permissionsList.at(parentIndex).get('children') as FormArray<PermissionChildGroup>
  }

  preparePermissionsList(permissions: Permission[]) {
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
    this.permissionsService
      .getAllPermission()
      .pipe(
        switchMap(allPermissions =>
          this.data
            ? this.getUserPermission(allPermissions)
            : of(allPermissions).pipe(tap(allPermissions => this.preparePermissionsForm(allPermissions)))
        ),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe()
  }

  private preparePermissionsForm(allPermissions: Permission[], userPermissions: Permission[] = []): void {
    allPermissions = this.categorizePermissions(allPermissions)
    this.permissions.set(allPermissions)
    this.preparePermissionsList(allPermissions)

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

    let areAllChildrenChecked = true

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

  categorizePermissions(data: Permission[]) {
    const generalItems = data.filter(item => item.is_general)
    const nonGeneralItems = data.filter(item => !item.is_general)

    generalItems.forEach(general => {
      general.children = nonGeneralItems.filter(nonGeneral => nonGeneral.key.includes(general.key))
    })

    return generalItems
  }

  getUserPermission(allPermissions: Permission[]) {
    return this.permissionsService.getUserPermission(this.data.userId).pipe(
      tap(userPermissions => {
        this.preparePermissionsForm(allPermissions, userPermissions)
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
