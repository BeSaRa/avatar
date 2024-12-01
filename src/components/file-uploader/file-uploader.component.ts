import { DndFileUploaderDirective } from '@/directives/dnd-file-uploader.directive'
import { DocIntelligenceService } from '@/services/doc-intelligence.service'
import { FileUploaderService } from '@/services/file-uploader.service'
import { LocalService } from '@/services/local.service'
import { DocumentFileType } from '@/types/dcoument-file-type'
import { NgTemplateOutlet } from '@angular/common'
import { Component, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core'
import {
  FindResultMatchesCount,
  FindState,
  NgxExtendedPdfViewerModule,
  NgxExtendedPdfViewerService,
} from 'ngx-extended-pdf-viewer'
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips'
import { MatFormFieldModule } from '@angular/material/form-field'
import { ENTER, SPACE } from '@angular/cdk/keycodes'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [
    DndFileUploaderDirective,
    NgTemplateOutlet,
    NgxExtendedPdfViewerModule,
    MatChipsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss',
})
export class FileUploaderComponent implements OnInit {
  inputFile = viewChild.required<ElementRef<HTMLInputElement>>('inputFile')
  lang = inject(LocalService)
  documentIntelligenceService = inject(DocIntelligenceService)
  uploader = inject(FileUploaderService)
  pdfViewer = inject(NgxExtendedPdfViewerService)
  searchContorl = inject(FormBuilder).control([''], { nonNullable: true })

  allowedType = input(['application/pdf'])

  files = signal<DocumentFileType[]>([])
  notAllowedFiles = signal<string>('')

  separatorKeysCodes = [ENTER, SPACE] // Allow space and enter as separators
  words = signal<string[]>([]) // Store words as chips

  pagesWithResult: number[] = []
  findState?: FindState
  currentMatchNumber?: number
  totalMatches?: number

  ngOnInit(): void {
    this.searchContorl.valueChanges.subscribe(res => {
      if (res.length) {
        this.find()
      }
    })
  }

  onFileUpload(event: DocumentFileType[]) {
    this.files.set(this.excludeNotAllowedFiles(event))
  }
  removeFile(event: MouseEvent) {
    this.notAllowedFiles.set('')
    event.stopPropagation()
    event.preventDefault()
    this.files.set([])
    this.inputFile().nativeElement.value = ''
  }
  analyzeFile() {
    if (!this.files().length) return
    const file = this.files().at(0)!
    this.documentIntelligenceService.documentAnalyze(file.file).subscribe(res => {
      console.log(res)
      const values = Object.values(res)
        .flatMap(value => {
          if (Array.isArray(value)) {
            return value.flatMap(item => Object.values(item))
          }
          return Object.values(value)
        })
        .filter(Boolean)
        .join(' ')

      this.setInitialChips(values)
    })
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
    return allowedFiles
  }
  setInitialChips(inputString: string): void {
    const words = inputString.split(' ').filter(word => word.trim() !== '')
    this.words.set(words)
    this.searchContorl.patchValue(words)
  }

  // Add a new chip
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim()

    if (value) {
      this.words().push(value)
    }

    // Clear the input
    event.chipInput!.clear()
  }

  // Remove a chip
  remove(word: string): void {
    const index = this.words().indexOf(word)

    if (index >= 0) {
      this.words().splice(index, 1)
    }
  }
  public findNext(): void {
    this.pdfViewer.findNext()
  }

  public findPrevious(): void {
    this.pdfViewer.findPrevious()
  }

  public updateFindState(result: FindState) {
    this.findState = result
  }

  public updateFindMatchesCount(result: FindResultMatchesCount) {
    this.currentMatchNumber = result.current
    this.totalMatches = result.total
  }

  private find(): Promise<number>[] | undefined {
    this.pagesWithResult = []
    if (!this.searchContorl.value.length) {
      this.findState = undefined
      this.currentMatchNumber = undefined
      this.totalMatches = undefined
    }
    const searchtext = this.words().join(' ')
    const numberOfResultsPromises = this.pdfViewer.find(searchtext, {
      highlightAll: true,
      matchDiacritics: true,
      useSecondaryFindcontroller: false,
      findMultiple: true,
    })
    numberOfResultsPromises?.forEach(async (numberOfResultsPromise, pageIndex) => {
      const numberOfResultsPerPage = await numberOfResultsPromise
      if (numberOfResultsPerPage > 0) {
        this.pagesWithResult.push(pageIndex)
      }
    })
    return numberOfResultsPromises
  }
}
