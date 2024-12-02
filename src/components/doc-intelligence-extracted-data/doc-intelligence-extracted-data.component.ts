import { DocumentIntelligenceContract } from '@/contracts/doc-intelligence-contract'
import { LocalService } from '@/services/local.service'
import { Component, inject, input } from '@angular/core'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatTooltipModule } from '@angular/material/tooltip'

@Component({
  selector: 'app-doc-intelligence-extracted-data',
  standalone: true,
  imports: [MatExpansionModule, MatTooltipModule],
  templateUrl: './doc-intelligence-extracted-data.component.html',
  styleUrl: './doc-intelligence-extracted-data.component.scss',
})
export class DocIntelligenceExtractedDataComponent {
  lang = inject(LocalService)
  extractedData = input.required<DocumentIntelligenceContract>()
}
