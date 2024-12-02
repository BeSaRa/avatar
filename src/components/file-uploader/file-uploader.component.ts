import { DndFileUploaderDirective } from '@/directives/dnd-file-uploader.directive'
import { FileUploaderService } from '@/services/file-uploader.service'
import { LocalService } from '@/services/local.service'
import { DocumentFileType } from '@/types/dcoument-file-type'
import { NgTemplateOutlet } from '@angular/common'
import { Component, ElementRef, inject, input, output, signal, viewChild } from '@angular/core'

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [DndFileUploaderDirective, NgTemplateOutlet],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss',
})
export class FileUploaderComponent {
  inputFile = viewChild.required<ElementRef<HTMLInputElement>>('inputFile')
  lang = inject(LocalService)
  uploader = inject(FileUploaderService)

  allowedType = input(['application/pdf'])
  disableAllWhenUpload = input(false)
  onUpload = output()
  onRemoveAll = output()
  onRemoveFile = output()
  loadedFiles = output<DocumentFileType[]>()

  files = signal<DocumentFileType[]>([])
  notAllowedFiles = signal<string>('')

  onFileUpload(event: DocumentFileType[]) {
    this.files.set(this.excludeNotAllowedFiles(event))
  }
  removeFile(event: MouseEvent, fileIndex: number) {
    this.notAllowedFiles.set('')
    event.stopPropagation()
    event.preventDefault()
    this.files().splice(fileIndex, 1)
    this.inputFile().nativeElement.value = ''
    this.onRemoveFile.emit()
  }
  removeAllFiles() {
    this.notAllowedFiles.set('')
    this.files.set([])
    this.inputFile().nativeElement.value = ''
    this.onRemoveAll.emit()
  }

  onChooseFile(event: Event) {
    const target = event.target as HTMLInputElement
    if (!target?.files) return

    const files = Array.from(target.files)
    this.uploadFiles(files)
  }

  private async uploadFiles(files: File[]): Promise<void> {
    try {
      const result = await this.uploader.uploadFiles(files)
      this.files.set(this.excludeNotAllowedFiles(result))
    } catch (error) {
      console.error('Error uploading files:', error)
    }
  }
  private excludeNotAllowedFiles(files: DocumentFileType[]): DocumentFileType[] {
    this.notAllowedFiles.set('')
    const allowedFiles: DocumentFileType[] = []
    files.forEach(item => {
      const { file } = item
      if (!this.allowedType().includes(file.type)) {
        this.notAllowedFiles.update(() => `${this.notAllowedFiles()} ${file.name}`)
        return
      }
      allowedFiles.push(item)
    })
    this.loadedFiles.emit(allowedFiles)
    return allowedFiles
  }
}
