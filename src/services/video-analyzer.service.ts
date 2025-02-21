import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http'
import { computed, inject, Injectable, signal } from '@angular/core'
import { UrlService } from './url.service'
import { BehaviorSubject, map, Observable } from 'rxjs'
import { MediaVideoResultContract, VideoData, VideoIndexInfo } from '@/contracts/media-video-result-contract'
import { timeToSeconds } from '@/utils/insights.utils'
import { InsightsContract } from '@/contracts/insights'

@Injectable({
  providedIn: 'root',
})
export class VideoAnalyzerService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)
  private readonly httpBackEnd = inject(HttpBackend)

  videoDuration = signal<string>('') // HH:MM:SS
  videoLengthInSeconds = computed(() => timeToSeconds(this.videoDuration()))
  timelineSeek = new BehaviorSubject<number>(0)
  subtitleFile = signal('')

  getListOfVideos(): Observable<VideoData[]> {
    const url = `${this.urlService.URLS.VIDEO_ANALYZER}/videos`
    return this.http.get<MediaVideoResultContract<{ videos: VideoData[] }>>(url).pipe(map(res => res.data.videos))
  }

  uploadVideo(video: File) {
    const url = `${this.urlService.URLS.VIDEO_ANALYZER}/upload`
    const fd = new FormData()
    fd.append('file', video)
    return this.http.post<MediaVideoResultContract<{ video_id: string; video_url: string }>>(url, fd)
  }

  indexVideo(videoId: string) {
    const url = `${this.urlService.URLS.VIDEO_ANALYZER}/index`
    const params = new HttpParams().append('vid', videoId).append('bot_name', 'video-indexer').append('language', 'en')
    return this.http.get<
      MediaVideoResultContract<{
        res_data: InsightsContract
        summary: string
        video_download_url: string
        video_stream_url: string
        video_caption: string
      }>
    >(url, {
      params: params,
    })
  }

  getVideo(videoId: string) {
    const url = `${this.urlService.URLS.VIDEO_ANALYZER}/get_vi`
    const params = new HttpParams().append('vid', videoId)
    return this.http.get<MediaVideoResultContract<VideoIndexInfo>>(url, { params })
  }

  startVideoChat(videoId: string) {
    const url = `${this.urlService.URLS.VIDEO_ANALYZER}/start-video-chat`
    const params = new HttpParams().append('video_id', videoId).append('bot_name', 'video-indexer')
    return this.http.post<MediaVideoResultContract<string>>(url, null, { params: params })
  }

  getVttFile(url: string): Observable<string> {
    const http = new HttpClient(this.httpBackEnd)
    return http.get(url, { responseType: 'text' }).pipe(
      map((vttContent: string) => {
        console.log('VTT Content Fetched:', vttContent)
        const blob = new Blob([vttContent], { type: 'text/vtt' })
        return URL.createObjectURL(blob)
      })
    )
  }
}
