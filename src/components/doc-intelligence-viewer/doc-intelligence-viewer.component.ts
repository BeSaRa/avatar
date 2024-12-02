import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { LocalService } from '@/services/local.service'
import { DocumentFileType } from '@/types/dcoument-file-type'
import { ENTER, SPACE } from '@angular/cdk/keycodes'
import { Component, effect, inject, input, OnInit } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatTooltipModule } from '@angular/material/tooltip'
import {
  FindResultMatchesCount,
  FindState,
  NgxExtendedPdfViewerModule,
  NgxExtendedPdfViewerService,
  PDFNotificationService,
  RenderedTextLayerHighlights,
} from 'ngx-extended-pdf-viewer'
import { takeUntil } from 'rxjs'

@Component({
  selector: 'app-doc-intelligence-viewer',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule, MatChipsModule, MatFormFieldModule, ReactiveFormsModule, MatTooltipModule],
  templateUrl: './doc-intelligence-viewer.component.html',
  styleUrl: './doc-intelligence-viewer.component.scss',
})
export class DocIntelligenceViewerComponent extends OnDestroyMixin(class {}) implements OnInit {
  pdfViewer = inject(NgxExtendedPdfViewerService)
  pdfNotification = inject(PDFNotificationService)
  searchContorl = inject(FormBuilder).control([''], { nonNullable: true })
  lang = inject(LocalService)

  file = input.required<DocumentFileType>()
  words = input<string[]>([])

  separatorKeysCodes = [ENTER, SPACE] // Allow space and enter as separators

  pagesWithResult: number[] = []
  findState?: FindState
  currentMatchNumber?: number
  totalMatches?: number

  constructor() {
    super()
    effect(() => {
      if (this.pdfViewer.isRenderQueueEmpty()) {
        this.searchContorl.patchValue(this.words())
      }
      this.pdfNotification
        .onPDFJSInitSignal()
        ?.eventBus?.on('renderedtextlayerhighlights', (event: RenderedTextLayerHighlights) => {
          event.highlights.forEach(highlight => {
            highlight.style.border = '2px solid black'
          })
        })
    })
  }

  ngOnInit(): void {
    this.listenToWordsChange()
  }

  private listenToWordsChange() {
    this.searchContorl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.find()
    })
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
  findNext(): void {
    this.pdfViewer.findNext()
  }

  findPrevious(): void {
    this.pdfViewer.findPrevious()
  }

  updateFindState(result: FindState) {
    this.findState = result
  }

  updateFindMatchesCount(result: FindResultMatchesCount) {
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
