import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { AdminService } from '@/services/admin.service'
import { LocalService } from '@/services/local.service'
import { Component, inject, signal } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { finalize, takeUntil } from 'rxjs'

@Component({
  selector: 'app-upload-storage-file-popup',
  standalone: true,
  imports: [],
  templateUrl: './upload-storage-file-popup.component.html',
  styleUrl: './upload-storage-file-popup.component.scss',
})
export class UploadStorageFilePopupComponent extends OnDestroyMixin(class {}) {
  lang = inject(LocalService)
  adminService = inject(AdminService)
  data = inject<{ container_name: string; subfolder_name: string }>(MAT_DIALOG_DATA)
  ref = inject(MatDialogRef)

  uploadedFiles: { name: string; extension: string; file: File }[] = []
  errorMessages = signal<string[]>([]) // Changed to an array to handle multiple errors
  isUploading = false

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (!input.files || input.files.length === 0) return

    // Reset errors and handle multiple files
    this.errorMessages.set([])
    Array.from(input.files).forEach(file => {
      const fileName = file.name
      const extension = fileName.split('.').pop()?.toLowerCase()

      if (extension !== 'json' && extension !== 'pdf') {
        this.errorMessages.update(msg => [...msg, `'${fileName}' ${this.lang.locals.not_supported_filetype}`])
        return
      }

      if (extension === 'json') {
        this.validateJson(file)
      } else {
        this.addFile(file, extension)
      }
    })

    input.value = '' // Reset file input
  }

  async validateJson(file: File): Promise<void> {
    const requiredKeys = ['url', 'title', 'content'] // Replace with actual keys
    const fileContent = await file.text()
    try {
      const jsonData = JSON.parse(fileContent)
      const hasAllKeys = requiredKeys.every(key => key in jsonData)

      if (!hasAllKeys) {
        this.errorMessages.update(msg => [
          ...msg,
          `'${file.name}' ${this.lang.locals.json_warning}  ${requiredKeys.join(', ')}.`,
        ])
        return
      }

      this.addFile(file, 'json')
    } catch {
      this.errorMessages.update(msg => [...msg, `'${file.name}' ${this.lang.locals.not_valid_json}`])
    }
  }

  addFile(file: File, extension: string): void {
    // Check if the file is already added to avoid duplicates
    if (this.uploadedFiles.some(f => f.name === file.name)) {
      this.errorMessages.update(msg => [...msg, `'${file.name}' ${this.lang.locals.file_already_added}`])
      return
    }

    this.uploadedFiles.push({ name: file.name, extension, file })
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1)
  }

  uploadFiles(): void {
    this.isUploading = true
    const files = this.uploadedFiles.map(f => f.file)
    const { container_name, subfolder_name } = this.data
    this.adminService
      .uploadBlobs(files, { container_name, subfolder_name })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isUploading = false
          this.ref.close()
        })
      )
      .subscribe()
  }
}
