import { FileUploaderService } from '@/services/file-uploader.service'
import { DocumentFileType } from '@/types/dcoument-file-type'
import { DOCUMENT } from '@angular/common'
import { Directive, ElementRef, HostListener, inject, input, output } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

@Directive({
  selector: '[appDndUploader]',
  standalone: true,
})
export class DndFileUploaderDirective {
  document = inject(DOCUMENT)
  sanitizer = inject(DomSanitizer)
  uploader = inject(FileUploaderService)
  elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  dragHostClass = input([], {
    transform: (val: string | string[]) => (Array.isArray(val) ? val : val.split(' ')),
  })
  files = output<DocumentFileType[]>()

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    this.preventDefaults(event)
    this.addDragClass()
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    this.preventDefaults(event)
    this.removeDragClass()
  }

  @HostListener('drop', ['$event'])
  onDropFiles(event: DragEvent) {
    this.preventDefaults(event)
    this.removeDragClass()
    const files = this.getDroppedFiles(event)
    if (!files.length) return

    this.uploadFiles(files)
  }

  private preventDefaults(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
  }

  private addDragClass(): void {
    this.elementRef.nativeElement.classList.add(...this.dragHostClass())
  }

  private removeDragClass(): void {
    this.elementRef.nativeElement.classList.remove(...this.dragHostClass())
  }

  private getDroppedFiles(event: DragEvent): File[] {
    const { dataTransfer } = event
    if (!dataTransfer?.files) return []
    return Array.from(dataTransfer.files)
  }

  private async uploadFiles(files: File[]): Promise<void> {
    try {
      const result = await this.uploader.uploadFiles(files)
      this.files.emit(result)
    } catch (error) {
      console.error('Error uploading files:', error)
    }
  }
}
