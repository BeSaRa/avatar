import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { MediaCrawler } from '@/models/media-crawler'
import { map, Observable } from 'rxjs'
import { UploadBlobsOptions } from '@/types/upload-blobs.type'
import { IndexerInfoContract } from '@/contracts/indexer-info-contract'
import { FormGroup, NonNullableFormBuilder } from '@angular/forms'

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)
  private readonly fb = inject(NonNullableFormBuilder)

  crawlWeb(crawlerOptions: MediaCrawler) {
    const url = `${this.urlService.URLS.ADMIN}/crawler`
    return this.http.post(url, crawlerOptions)
  }

  getContainers(): Observable<string[]> {
    const url = `${this.urlService.URLS.ADMIN}/get-containers`
    return this.http.get<{ containers: string[] }>(url).pipe(map(res => res.containers))
  }

  getSubfolder(containerName: string): Observable<string[]> {
    const url = `${this.urlService.URLS.ADMIN}/get-subfolders/${containerName}`
    return this.http.post<{ subfolders: string[] }>(url, null).pipe(map(res => res.subfolders))
  }
  deleteSubfolder(containerName: string, subfolderName: string) {
    const url = `${this.urlService.URLS.ADMIN}/delete-subfolder`
    const params = new HttpParams().appendAll({ container_name: containerName, subfolder_name: subfolderName })
    return this.http.delete(url, { params: params })
  }
  deleteByMetadata(metadataKey: string, metadataValue: string) {
    const url = `${this.urlService.URLS.ADMIN}/delete-blob-by-metadata`
    const params = new HttpParams().appendAll({ metadata_key: metadataKey, metadata_value: metadataValue })
    return this.http.delete(url, { params: params })
  }
  deleteByListOfTitles(containerName: string, subfolderName: string, fileNames: string[]) {
    const url = `${this.urlService.URLS.ADMIN}/delete-blob-by-list-of-titles`
    const params = new HttpParams().appendAll({ container_name: containerName, subfolder_name: subfolderName })
    return this.http.delete(url, { params: params, body: fileNames })
  }
  getBlobs(containerName: string, subfolderName: string): Observable<string[]> {
    const url = `${this.urlService.URLS.ADMIN}/get-blobs/${containerName}`
    const param = new HttpParams().append('subfolder_name', subfolderName)
    return this.http.post<{ blobs: string[] }>(url, null, { params: param }).pipe(map(res => res.blobs))
  }
  uploadBlobs(files: File[], uploadBlobsOptions: UploadBlobsOptions) {
    const url = `${this.urlService.URLS.ADMIN}/upload-blobs`
    const params = new HttpParams({ fromObject: uploadBlobsOptions })
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    return this.http.post(url, formData, { params: params })
  }

  getIndexInfo(indexName: string): Observable<IndexerInfoContract> {
    const url = `${this.urlService.URLS.ADMIN}/index-info/${indexName}`
    return this.http.get<IndexerInfoContract>(url)
  }
  getIndexes(): Observable<string[]> {
    const url = `${this.urlService.URLS.ADMIN}/indexes-name`
    return this.http.get<{ indexes: string[] }>(url).pipe(map(res => res.indexes))
  }
  resetIndex(indexName: string, key = 'chunk_id', value?: string) {
    const url = `${this.urlService.URLS.ADMIN}/reset-index/${indexName}`
    let params = new HttpParams()
    if (value) params = new HttpParams().append('key', key).append('value', value)
    return this.http.post(url, null, { params: params })
  }

  runIndexer(indexName: string) {
    const url = `${this.urlService.URLS.ADMIN}/run-indexer/${indexName}`
    return this.http.post(url, null)
  }
  secureUrl(blobUrl: string) {
    const url = `${this.urlService.URLS.ADMIN}/sas-token`
    const param = new HttpParams().append('blob_url', blobUrl)
    return this.http.get<string>(url, { params: param })
  }

  createUrlGroup(): FormGroup {
    return this.fb.group({
      link: this.fb.control(''),
      headers: this.fb.array([]),
      cookies: this.fb.array([]),
      payload: this.fb.array([]),
      settings: this.createSettingsGroup(),
    })
  }

  createSettingsGroup(): FormGroup {
    return this.fb.group({
      deep: this.fb.control(false),
      selectors: this.fb.control([]),
      mediaCrawling: this.fb.control(false),
      containerName: this.fb.control('rera-storage'),
    })
  }
}
