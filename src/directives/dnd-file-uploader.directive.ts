import { FileUploaderService } from '@/services/file-uploader.service'
import { DOCUMENT } from '@angular/common'
import { Directive, HostBinding, HostListener, inject, output } from '@angular/core'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'

@Directive({
  selector: '[appDndUploader]',
  standalone: true,
})
export class DndFileUploaderDirective {
  document = inject(DOCUMENT)
  sanitizer = inject(DomSanitizer)
  uploader = inject(FileUploaderService)
  files = output<{ file: File; url: SafeUrl }[]>()

  @HostBinding('class.!bg-gray-200') isdraged = false

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.stopPropagation()
    event.preventDefault()
    this.isdraged = true
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.stopPropagation()
    event.preventDefault()
    this.isdraged = false
  }

  @HostListener('drop', ['$event'])
  onDropFiles(event: DragEvent) {
    event.stopPropagation()
    event.preventDefault()
    this.isdraged = false

    const { dataTransfer } = event
    if (!dataTransfer?.files) return

    const uploadedFiles = Array.from({ length: dataTransfer.files.length }, (_, i) => dataTransfer.files.item(i)!)
    this.uploader.uploadFiles(uploadedFiles).then(res => {
      this.files.emit(res)
    })
  }
}
