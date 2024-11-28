import { DndFileUploaderDirective } from '@/directives/dnd-file-uploader.directive'
import { NgTemplateOutlet } from '@angular/common'
import { Component, signal } from '@angular/core'
import { SafeUrl } from '@angular/platform-browser'

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [DndFileUploaderDirective, NgTemplateOutlet],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss',
})
export class FileUploaderComponent {
  files = signal<{ file: File; url: SafeUrl }[]>([])
  onFileUpload(event: { file: File; url: SafeUrl }[]) {
    this.files.set(event)
  }
  removeFile(event: MouseEvent) {
    event.stopPropagation()
    event.preventDefault()
    this.files().shift()
  }
}
