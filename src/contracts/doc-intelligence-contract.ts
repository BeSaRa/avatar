export interface DocumentIntelligenceContract {
  'extracted-elements': ExtractedElement
  'extracted-table': ExtractedTable[]
}

interface ExtractedElement {
  'company-name': string
  'physical-state': string
  'product-name': string
  address: string
  precautions: string
  storage: string
}

interface ExtractedTable {
  'chemical-name': string
  'cas-no': string
  'ec-no': string
  'clp-classification': string
}
