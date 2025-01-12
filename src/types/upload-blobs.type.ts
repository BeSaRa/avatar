type BLOBMetadata = Partial<Record<`metadata_${1 | 2 | 4}`, string>>

export type UploadBlobsOptions = {
  container_name: string
  subfolder_name: string
} & BLOBMetadata
