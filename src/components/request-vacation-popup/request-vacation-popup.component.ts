import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { LocalService } from '@/services/local.service'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { InteractiveChatService } from '@/services/interactive-chat.service'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { takeUntil, tap } from 'rxjs'
import { AsyncPipe } from '@angular/common'
import { FunctionArguments } from '@/contracts/tool-call-contract'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-request-vacation-popup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AsyncPipe,
    CdkDrag,
    CdkDragHandle,
  ],
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS }],
  templateUrl: './request-vacation-popup.component.html',
  styleUrl: './request-vacation-popup.component.scss',
})
export class RequestVacationPopupComponent extends OnDestroyMixin(class {}) implements OnInit {
  lang = inject(LocalService)
  data = inject<FunctionArguments<'fill_vacation_form'>>(MAT_DIALOG_DATA)
  ref = inject(MatDialogRef)
  fb = inject(FormBuilder)
  interactiveChatService = inject(InteractiveChatService)
  loader = signal(false)
  types$ = this.interactiveChatService
    .getAllVacationTypes()
    .pipe(takeUntil(this.destroy$))
    .pipe(tap(() => this.vacationRequestForm.patchValue({ vacation_type: this.data.vacation_type })))

  departments$ = this.interactiveChatService
    .getDepartmentTypes()
    .pipe(takeUntil(this.destroy$))
    .pipe(tap(() => this.vacationRequestForm.patchValue({ employee_department: this.data.employee_department })))

  vacationRequestForm!: FormGroup

  createVacationForm() {
    this.vacationRequestForm = this.fb.nonNullable.group({
      vacation_type: ['', Validators.required],
      employee_name: ['', Validators.required],
      employee_ID: ['', Validators.required],
      manager_name: ['', Validators.required],
      employee_department: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      comments: [''],
    })
  }

  /**
   *
   */
  constructor() {
    super()
    this.createVacationForm()
  }
  ngOnInit(): void {
    console.log(this.data)
    this.vacationRequestForm.patchValue(this.data)
  }

  onSubmit() {
    this.loader.set(true)
    this.interactiveChatService
      .submitVactionRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loader.update(() => false))
  }
}
