import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { map, Observable } from 'rxjs'
import { MediaVideoResultContract, VideoData, VideoIndexInfo } from '@/contracts/media-video-result-contract'

@Injectable({
  providedIn: 'root',
})
export class VideoAnalyzerService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)

  getListOfVideos(): Observable<VideoData[]> {
    const url = `${this.urlService.URLS.VIDEO_ANALYZER}/get_all_videos`
    return this.http.get<MediaVideoResultContract<{ videos: VideoData[] }>>(url).pipe(map(res => res.data.videos))
  }

  uploadVideo(video: File) {
    const url = `${this.urlService.URLS.VIDEO_ANALYZER}/upload_video`
    const fd = new FormData()
    fd.append('file', video)
    return this.http.post<MediaVideoResultContract<VideoIndexInfo>>(url, fd)
  }

  getVideo(videoId: string) {
    const url = `${this.urlService.URLS.VIDEO_ANALYZER}/get_vi`
    const params = new HttpParams().append('vid', videoId)
    return this.http.get<MediaVideoResultContract<VideoIndexInfo>>(url, { params })
  }
}
