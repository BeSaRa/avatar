import { DOCUMENT } from '@angular/common'
import { inject, Injectable } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

@Injectable({
  providedIn: 'root',
})
export class FileUploaderService {
  document = inject(DOCUMENT)
  sanitizer = inject(DomSanitizer)

  async uploadFiles(files: File[]) {
    return await Promise.all(files.map(file => this.handleReadFile(file)))
  }

  handleReadFile(file: File) {
    const reader = new FileReader()
    return new Promise<{ file: File; url: string }>(resolve => {
      reader.onload = e => {
        const uploadedFile = {
          file: file,
          url: this.document.defaultView!.URL.createObjectURL(file),
          base64: e.target!.result,
        }
        return resolve(uploadedFile)
      }
      reader.readAsDataURL(file)
    })
  }
}
