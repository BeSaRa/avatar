import { AgentChatService } from '@/services/agent-chat.service'
import { LocalService } from '@/services/local.service'
import { Component, inject, OnInit } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { SpinnerLoaderComponent } from '../spinner-loader/spinner-loader.component'
import { finalize } from 'rxjs'

@Component({
  selector: 'app-agent-task-status-popup',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, SpinnerLoaderComponent],
  templateUrl: './agent-task-status-popup.component.html',
  styleUrl: './agent-task-status-popup.component.scss',
})
export class AgentTaskStatusPopupComponent implements OnInit {
  lang = inject(LocalService)
  agentChatService = inject(AgentChatService)
  dialogRef = inject(MatDialogRef)
  data: { status: string; task_id: string } = inject(MAT_DIALOG_DATA)

  status = new FormControl(this.data.status)

  taskStatus: string[] = []
  isSaving = false

  ngOnInit(): void {
    this.agentChatService.loadTaskStatus().subscribe(res => (this.taskStatus = res))
  }

  save() {
    this.isSaving = true
    this.agentChatService
      .updateTaskStatus(this.data.task_id, this.status.value!)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe(() => this.dialogRef.close())
  }
}
