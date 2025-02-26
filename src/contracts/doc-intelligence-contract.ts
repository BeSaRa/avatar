export interface PersonInCharge {
  name: string
  position: string
  address: string
  phone: string
  fax: string
}

export interface ExtractedDetails {
  'application-number': string
  'project-name': string
  'project-type': string
  'project-proponent': string
  'person-in-charge': PersonInCharge
  'licensing-authority': string
}

export interface PipeLaying {
  '150mm': string
  '300mm': string
}

export interface AvailableInfrastructure {
  'water-supply': boolean
  'electric-power-grid': boolean
  'sewer-system': boolean
  'road-network': boolean
  'fuel-source': boolean
}

export interface ProjectData {
  'project-location': string
  'industrial-zone': boolean
  village: boolean
  city: boolean
  'other-places': boolean
  'pipe-laying': PipeLaying
  'total-project-area': string
  'total-construction-area': string
  'project-nature': string
  'expansion-or-renovation': string
  'previous-environmental-approval': boolean
  'previous-approval-date': string
  'final-product': string
  'available-infrastructure': AvailableInfrastructure
}

export interface ProjectPhases {
  'construction-start-date': string
  'operation-start-date': string
}

export interface ConstructionStage {
  description: string
  'fuel-type': string
  'fuel-source': string
}

export interface ConstructionWaste {
  'solid-waste': string
  'liquid-waste': string
  'gaseous-emissions': string
  'equipment-used': string[]
  'noise-level': string
  'noise-type': string
}

export interface LiquidWaste {
  'sanitary-discharge-rate': string
  'control-methods': string
  'disposal-methods': string
}

export interface IndustrialDischarge {
  'discharge-rate': string
  'control-methods': string
  analysis: string
  'disposal-method': string
}

export interface GaseousEmissions {
  'stationary-sources': string
  'mobile-sources': string
  'fuel-combustion-sources': string
}

export interface SolidWaste {
  'transport-handling-storage': string
  disposal: string
}

export interface OperationWaste {
  'liquid-waste': LiquidWaste
  'industrial-discharge': IndustrialDischarge
  'gaseous-emissions': GaseousEmissions
  'solid-waste': SolidWaste
}

export interface DocumentIntelligenceContract {
  'extracted-details': ExtractedDetails
  'project-data': ProjectData
  'project-phases': ProjectPhases
  'construction-stage': ConstructionStage
  'construction-waste': ConstructionWaste
  'operation-waste': OperationWaste
}
