import { Component, inject, signal } from '@angular/core'
import { DocumentIntelligenceContract } from '@/contracts/doc-intelligence-contract'
import { DocIntelligenceService } from '@/services/doc-intelligence.service'
import { DocumentFileType } from '@/types/dcoument-file-type'
import { FileUploaderComponent } from '@/components/file-uploader/file-uploader.component'
import { DocIntelligenceViewerComponent } from '@/components/doc-intelligence-viewer/doc-intelligence-viewer.component'
// eslint-disable-next-line max-len
import { DocIntelligenceExtractedDataComponent } from '@/components/doc-intelligence-extracted-data/doc-intelligence-extracted-data.component'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { takeUntil, tap } from 'rxjs'
import { AsyncPipe } from '@angular/common'
import { LocalService } from '@/services/local.service'

@Component({
  selector: 'app-document-intelligence',
  standalone: true,
  imports: [FileUploaderComponent, DocIntelligenceViewerComponent, DocIntelligenceExtractedDataComponent, AsyncPipe],
  templateUrl: './document-intelligence.component.html',
  styleUrl: './document-intelligence.component.scss',
})
export class DocumentIntelligenceComponent extends OnDestroyMixin(class {}) {
  lang = inject(LocalService)
  documentIntelligenceService = inject(DocIntelligenceService)
  files = signal<DocumentFileType[]>([])
  words = signal<string[]>([])
  result!: DocumentIntelligenceContract
  isDataReady = signal(false)
  isLoading = signal(false)

  analyzeFile() {
    if (!this.files().length) return
    this.isLoading.set(true)
    this.isDataReady.set(false)
    const { file } = this.files().at(0)!
    this.documentIntelligenceService
      .documentAnalyze(file)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.isLoading.set(false))
      )
      .subscribe(res => {
        this.result = res
        const values = Object.values(res)
          .flatMap(value => {
            if (Array.isArray(value)) {
              return value.flatMap(item => Object.values(item))
            }
            return Object.values(value)
          })
          .filter(Boolean)
          .join(' ')

        this.words.set(values.split(' ').filter(word => word.trim() !== ''))
        this.isDataReady.set(true)
      })
  }

  onFileLoad($event: DocumentFileType[]) {
    this.files.set($event)
  }
  onFileRemoved() {
    this.words.set([])
    this.files.set([])
    this.isDataReady.set(false)
  }
}
