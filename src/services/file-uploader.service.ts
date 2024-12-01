import { DocumentFileType } from '@/types/dcoument-file-type'
import { DOCUMENT } from '@angular/common'
import { inject, Injectable } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

@Injectable({
  providedIn: 'root',
})
export class FileUploaderService {
  document = inject(DOCUMENT)
  sanitizer = inject(DomSanitizer)

  async uploadFiles(files: File[]): Promise<DocumentFileType[]> {
    return await Promise.all(files.map(file => this.handleReadFile(file)))
  }

  handleReadFile(file: File): Promise<DocumentFileType> {
    const reader = new FileReader()
    return new Promise<DocumentFileType>(resolve => {
      reader.onload = e => {
        const uploadedFile = {
          file: file,
          url: this.document.defaultView!.URL.createObjectURL(file),
          base64: e.target!.result as string,
        }
        return resolve(uploadedFile)
      }
      reader.readAsDataURL(file)
    })
  }
}
