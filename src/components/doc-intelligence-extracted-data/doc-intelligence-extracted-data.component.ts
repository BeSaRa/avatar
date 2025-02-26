import {
  ConstructionStage,
  ConstructionWaste,
  DocumentIntelligenceContract,
  ExtractedDetails,
  OperationWaste,
  ProjectData,
  ProjectPhases,
} from '@/contracts/doc-intelligence-contract'
import { LangKeysContract } from '@/contracts/lang-keys-contract'
import { LocalService } from '@/services/local.service'
import { KeyValuePipe } from '@angular/common'
import { Component, computed, inject, input } from '@angular/core'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatTooltipModule } from '@angular/material/tooltip'

@Component({
  selector: 'app-doc-intelligence-extracted-data',
  standalone: true,
  imports: [MatExpansionModule, MatTooltipModule, KeyValuePipe],
  templateUrl: './doc-intelligence-extracted-data.component.html',
  styleUrl: './doc-intelligence-extracted-data.component.scss',
})
export class DocIntelligenceExtractedDataComponent {
  lang = inject(LocalService)
  extractedData = input.required<DocumentIntelligenceContract>()
  mappedData = computed(() => this.convertToRecord(this.extractedData()))

  private convertToRecord(
    obj: DocumentIntelligenceContract
  ): Record<
    string,
    ExtractedDetails | ProjectData | ProjectPhases | ConstructionStage | ConstructionWaste | OperationWaste
  > {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => {
        acc[key] = value
        return acc
      },
      {} as Record<
        string,
        ExtractedDetails | ProjectData | ProjectPhases | ConstructionStage | ConstructionWaste | OperationWaste
      >
    )
  }

  isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length > 0
  }

  asRecord(
    value: unknown
  ): Record<
    string,
    ExtractedDetails | ProjectData | ProjectPhases | ConstructionStage | ConstructionWaste | OperationWaste
  > {
    return this.isObject(value)
      ? (value as Record<
          string,
          ExtractedDetails | ProjectData | ProjectPhases | ConstructionStage | ConstructionWaste | OperationWaste
        >)
      : {}
  }

  getLocalizedKey(key: string): string {
    return key in this.lang.locals ? this.lang.locals[key as keyof LangKeysContract] : key
  }
}
