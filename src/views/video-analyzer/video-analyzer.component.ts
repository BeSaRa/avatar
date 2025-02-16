import { ListVideosPopupComponent } from '@/components/list-videos-popup/list-videos-popup.component'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { FileUploaderService } from '@/services/file-uploader.service'
import { LocalService } from '@/services/local.service'
import { VideoAnalyzerService } from '@/services/video-analyzer.service'
import { VideoIndexerChatService } from '@/services/video-indexer-chat.service'
import { AppStore } from '@/stores/app.store'
import { DocumentFileType } from '@/types/dcoument-file-type'
import { captureVideoThumbnail } from '@/utils/utils'
import { Component, inject, signal, viewChild, ElementRef, OnInit } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { catchError, delay, EMPTY, expand, filter, finalize, switchMap, takeUntil, tap } from 'rxjs'
import { ChatContainerComponent } from '../../components/chat-container/chat-container.component'
import { BaseChatService } from '@/services/base-chat.service'
import { VideoData } from '@/contracts/media-video-result-contract'
import { NgClass } from '@angular/common'
import { slideIn } from '@/animations/fade-in-slide'
import { InsightsContract } from '@/contracts/insights'
import { VideoInsightsComponent } from '../../components/video-insights/video-insights.component'
import { secondsToTime } from '@/utils/insights.utils'

@Component({
  selector: 'app-video-analyzer',
  standalone: true,
  imports: [ReactiveFormsModule, ChatContainerComponent, NgClass, VideoInsightsComponent],
  templateUrl: './video-analyzer.component.html',
  providers: [
    { provide: BaseChatService, useExisting: VideoIndexerChatService }, // Providing the actual implementation
  ],
  animations: [slideIn],
  styleUrl: './video-analyzer.component.scss',
})
export class VideoAnalyzerComponent extends OnDestroyMixin(class {}) implements OnInit {
  lang = inject(LocalService)
  fileUploaderService = inject(FileUploaderService)
  videoAnalyzerService = inject(VideoAnalyzerService)
  videoIndexerChatService = inject(VideoIndexerChatService)
  video = signal<DocumentFileType | undefined>(undefined)
  videoData = signal<VideoData | undefined>(undefined)
  insights = signal<InsightsContract | undefined>(undefined)
  dialog = inject(MatDialog)
  store = inject(AppStore)
  selectedVideo = viewChild<ElementRef<HTMLVideoElement>>('selectedVideo')
  chatContainer = viewChild<ChatContainerComponent>('chatBox')
  poster = signal('')
  isLoading = signal<'UPLOAD' | 'GET_INFO' | undefined>(undefined)
  botName = signal('')
  indexingProgress = signal('')
  selectedTab = signal<'CHAT' | 'INSIGHTS'>('INSIGHTS')

  ngOnInit(): void {
    this.videoAnalyzerService.timelineSeek
      .pipe(
        tap(res => {
          if (this.selectedVideo()?.nativeElement && res) {
            this.selectedVideo()!.nativeElement.currentTime = res
          }
        })
      )
      .subscribe()
  }

  async uploadVideo(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement

    if (!target?.files || target.files.length === 0) {
      console.warn('No files selected for upload.')
      return
    }

    try {
      const files = Array.from(target.files)
      this.isLoading.set('UPLOAD')

      // Upload files and handle the response
      const uploadedFiles = await this.fileUploaderService.uploadFiles(files)

      if (!uploadedFiles?.length) {
        throw new Error('File upload failed. No files returned from the server.')
      }

      const uploadedFile = uploadedFiles[0]
      this.videoAnalyzerService
        .uploadVideo(uploadedFile.file)
        .pipe(
          takeUntil(this.destroy$),
          tap(() => {
            this.chatContainer()?.clearChatHistory()
            this.video.set(uploadedFile)
            this.videoData.set(undefined)
            this.isLoading.set('GET_INFO')
          }),
          switchMap(({ data }) =>
            this.videoAnalyzerService.indexVideo(data.video_id).pipe(
              expand(res => {
                if (res.status_code !== 200) {
                  this.indexingProgress.set(
                    ('videos' in res.data && Array.isArray(res.data.videos)
                      ? res.data?.videos?.[0]?.processingProgress
                      : '') || ''
                  ) // Update UI with progress
                  return this.videoAnalyzerService.indexVideo(data.video_id).pipe(delay(2000))
                }
                return EMPTY
              }),
              filter(res => res.status_code === 200), // Only process when status is 200
              tap(({ data }) => {
                this.videoAnalyzerService.videoDuration.set(data.res_data.duration)
                this.insights.set(data.res_data)
              }),
              switchMap(() =>
                this.videoAnalyzerService.startVideoChat(data.video_id).pipe(
                  tap(chatData => {
                    this.videoIndexerChatService.conversationId.set(chatData.data)
                  })
                )
              ),
              catchError(error => {
                console.error('Error during video indexing:', error)
                return EMPTY
              }),
              finalize(() => {
                this.isLoading.set(undefined)
                this.indexingProgress.set('')
              })
            )
          ),
          catchError(error => {
            console.error('Error during video processing:', error)
            return EMPTY
          }),
          finalize(() => {
            this.generateVideoThumbnail()
          })
        )
        .subscribe()
    } catch (error) {
      console.error('Error during file upload:', error)
      this.isLoading.set(undefined)
    }
  }

  private async generateVideoThumbnail(): Promise<void> {
    try {
      const videoElement = this.selectedVideo()?.nativeElement

      if (!videoElement) {
        console.warn('Video element not found for thumbnail capture.')
        return
      }
      this.videoAnalyzerService.videoDuration.set(secondsToTime(videoElement.duration))
      // Wait for the video to appear on the screen
      setTimeout(async () => {
        try {
          const poster = await captureVideoThumbnail(videoElement)
          this.poster.set(poster)
        } catch (error) {
          console.error('Error capturing video thumbnail:', error)
        }
      }, 1000) // Adjust the delay as needed
    } catch (error) {
      console.error('Error generating video thumbnail:', error)
    }
  }

  openVideosList() {
    this.dialog
      .open<ListVideosPopupComponent, void, VideoData>(ListVideosPopupComponent)
      .afterClosed()
      .pipe(
        tap(() => this.isLoading.set('GET_INFO')),
        filter((video): video is VideoData => !!video),
        switchMap(video => {
          return this.videoAnalyzerService.indexVideo(video.id).pipe(
            takeUntil(this.destroy$),
            tap(({ data }) => {
              this.videoAnalyzerService.videoDuration.set(data.res_data.duration)
              this.insights.set(data.res_data)
              // Clear chat history and update video-related data
              this.chatContainer()?.clearChatHistory()
              this.video.set(undefined)
              this.videoData.set(video)
            }),
            switchMap(() =>
              this.videoAnalyzerService.startVideoChat(video.id).pipe(
                tap(chatData => {
                  this.videoIndexerChatService.conversationId.set(chatData.data)
                })
              )
            ),
            finalize(() => this.isLoading.set(undefined)),

            // Error handling: log the error or notify the user
            catchError(error => {
              console.error('Error fetching video data:', error)
              return EMPTY // Prevents further operations on error
            })
          )
        })
      )
      .subscribe()
  }
}
