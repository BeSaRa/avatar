import { ListVideosPopupComponent } from '@/components/list-videos-popup/list-videos-popup.component'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { FileUploaderService } from '@/services/file-uploader.service'
import { LocalService } from '@/services/local.service'
import { VideoAnalyzerService } from '@/services/video-analyzer.service'
import { VideoIndexerChatService } from '@/services/video-indexer-chat.service'
import { AppStore } from '@/stores/app.store'
import { DocumentFileType } from '@/types/dcoument-file-type'
import { captureVideoThumbnail } from '@/utils/utils'
import { Component, inject, signal, viewChild, ElementRef } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { catchError, EMPTY, filter, finalize, switchMap, takeUntil, tap } from 'rxjs'
import { ChatContainerComponent } from '../../components/chat-container/chat-container.component'
import { BaseChatService } from '@/services/base-chat.service'
import { VideoData } from '@/contracts/media-video-result-contract'
import { NgClass } from '@angular/common'
import { slideIn } from '@/animations/fade-in-slide'

@Component({
  selector: 'app-video-analyzer',
  standalone: true,
  imports: [ReactiveFormsModule, ChatContainerComponent, NgClass],
  templateUrl: './video-analyzer.component.html',
  providers: [
    { provide: BaseChatService, useExisting: VideoIndexerChatService }, // Providing the actual implementation
  ],
  animations: [slideIn],
  styleUrl: './video-analyzer.component.scss',
})
export class VideoAnalyzerComponent extends OnDestroyMixin(class {}) {
  lang = inject(LocalService)
  fileUploaderService = inject(FileUploaderService)
  videoAnalyzerService = inject(VideoAnalyzerService)
  videoIndexerChatService = inject(VideoIndexerChatService)
  video = signal<DocumentFileType | undefined>(undefined)
  videoData = signal<VideoData | undefined>(undefined)
  dialog = inject(MatDialog)
  store = inject(AppStore)
  selectedVideo = viewChild<ElementRef<HTMLVideoElement>>('selectedVideo')
  chatContainer = viewChild<ChatContainerComponent>('chatBox')
  poster = signal('')
  isLoading = signal<'UPLOAD' | 'GET_INFO' | undefined>(undefined)
  botName = signal('')

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

      if (uploadedFiles.length === 0) {
        throw new Error('File upload failed. No files returned from the server.')
      }
      this.videoAnalyzerService
        .uploadVideo(uploadedFiles[0].file)
        .pipe(
          takeUntil(this.destroy$),
          tap(({ data }) => {
            this.chatContainer()?.clearChatHistory()
            this.botName.set(data.bot_name)
            this.videoIndexerChatService.conversationId.set(data.conversation_id)
            this.video.set(uploadedFiles[0])
            this.videoData.set(undefined)
          }),
          catchError(error => {
            console.error('Error during video processing:', error)
            return EMPTY // Prevents further processing on error
          }),
          finalize(() => {
            this.isLoading.set(undefined)
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
          return this.videoAnalyzerService.getVideo(video.id).pipe(
            takeUntil(this.destroy$),
            tap(({ data }) => {
              // Clear chat history and update video-related data
              this.chatContainer()?.clearChatHistory()
              this.video.set(undefined)
              this.botName.set(data.bot_name)
              this.videoIndexerChatService.conversationId.update(() => data.conversation_id)
              this.videoData.set(video)
            }),
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
