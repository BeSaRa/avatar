import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { JsonHighlightPipe } from '@/pipes/json-highlight.pipe'
import { LocalService } from '@/services/local.service'
import { DOCUMENT } from '@angular/common'
import { Component, inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-json-previewer-popup',
  standalone: true,
  imports: [JsonHighlightPipe, PerfectScrollDirective],
  templateUrl: './json-previewer-popup.component.html',
  styleUrl: './json-previewer-popup.component.scss',
})
export class JsonPreviewerPopupComponent<TData extends object> {
  data = inject<TData>(MAT_DIALOG_DATA)
  doc = inject(DOCUMENT)
  lang = inject(LocalService)
  formatedValue?: TData = this.data

  copyToClipboard(): void {
    const txt = JSON.stringify(this.formatedValue, null, 2)
    this.doc.defaultView?.navigator.clipboard.writeText(txt).then(
      () => {
        console.log('JSON copied to clipboard successfully!')
      },
      err => {
        console.error('Failed to copy JSON:', err)
      }
    )
  }
}
