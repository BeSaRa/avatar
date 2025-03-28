import { Instance, InstanceGroup } from '@/contracts/insights'
import { LocalService } from '@/services/local.service'
import { VideoAnalyzerService } from '@/services/video-analyzer.service'
import { TailwindColorWithShade } from '@/types/tailwind-colors-type'
import { timeToSeconds } from '@/utils/insights.utils'
import { NgClass } from '@angular/common'
import { Component, ElementRef, inject, input, NgZone, output, ViewChild } from '@angular/core'

@Component({
  selector: 'app-insights-timeline',
  standalone: true,
  imports: [NgClass],
  templateUrl: './insights-timeline.component.html',
  styleUrl: './insights-timeline.component.scss',
})
export class InsightsTimelineComponent {
  instanceGroup = input.required<InstanceGroup[]>()
  instanceClicked = output<number>()

  @ViewChild('timelineSvg', { static: true }) timelineSvg!: ElementRef

  progressWidth = 0
  tooltipVisible = false
  tooltipPosition = 0
  currentInstanceIndex = 0
  currentPercentage = 0
  tooltipTime = ''
  tooltipBackgroundClass = 'bg-gray-800'

  private lastMouseMoveTime = 0

  ngZone = inject(NgZone)
  videoAnalyzer = inject(VideoAnalyzerService)
  lang = inject(LocalService)

  onRectMouseMoveOptimized(
    event: MouseEvent,
    isInstance = false,
    instanceColor?: `bg-${TailwindColorWithShade}`
  ): void {
    const currentTime = performance.now()

    // Throttle mousemove events to prevent excessive change detection cycles
    if (currentTime - this.lastMouseMoveTime < 16) return // Approx. 60fps limit

    this.lastMouseMoveTime = currentTime

    this.ngZone.runOutsideAngular(() => {
      const boundingRect = this.timelineSvg.nativeElement.getBoundingClientRect()
      const offsetX = event.clientX - boundingRect.left
      const timelineWidth = boundingRect.width

      const percentage = (offsetX / timelineWidth) * 100
      this.tooltipPosition = offsetX - 22
      this.tooltipTime = this.percentageToTime(percentage)
      this.tooltipBackgroundClass = instanceColor ?? 'bg-gray-300'
      if (isInstance) {
        this.tooltipBackgroundClass = instanceColor ?? 'bg-primary'
      }
      // Run inside Angular's zone to trigger view update only when necessary
      this.ngZone.run(() => {
        this.tooltipVisible = true
      })
    })
  }

  onTimelineClick(event: MouseEvent): void {
    const boundingRect = this.timelineSvg.nativeElement.getBoundingClientRect()
    const offsetX = event.clientX - boundingRect.left
    const timelineWidth = boundingRect.width

    const percentage = (offsetX / timelineWidth) * 100
    this.progressWidth = percentage
    this.currentPercentage = percentage
    const time = this.percentageToTime(percentage)
    this.videoAnalyzer.timelineSeek.next(timeToSeconds(time))
  }

  calculateWidth(instance: Instance): string {
    const start = this.timeToPercentage(instance.adjustedStart)
    const end = this.timeToPercentage(instance.adjustedEnd)
    return (end - start).toFixed(2) + '%'
  }

  calculatePosition(instance: Instance): string {
    return this.timeToPercentage(instance.adjustedStart).toFixed(2) + '%'
  }

  onInstanceClick(index: number, instance: Instance, event: MouseEvent): void {
    event.stopPropagation() // Prevent the timeline click handler from also triggering
    const boundingRect = this.timelineSvg.nativeElement.getBoundingClientRect()
    const offsetX = event.clientX - boundingRect.left
    const timelineWidth = boundingRect.width

    // Calculate exact percentage within the timeline on click
    const percentage = (offsetX / timelineWidth) * 100
    this.progressWidth = percentage
    this.currentPercentage = percentage
    const time = this.percentageToTime(percentage)
    this.instanceClicked.emit(index)
    this.videoAnalyzer.timelineSeek.next(timeToSeconds(time))
  }

  hideTooltip(): void {
    this.tooltipVisible = false
  }

  navigateToInstance(instance: Instance): void {
    const percentage = this.timeToPercentage(instance.adjustedStart)
    this.progressWidth = percentage
    this.currentPercentage = percentage
    const time = instance.adjustedStart
    this.videoAnalyzer.timelineSeek.next(timeToSeconds(time))
  }

  navigateToNextInstance(): void {
    let nextInstance: Instance | null = null

    for (const group of this.instanceGroup()) {
      for (const instance of group.instances) {
        if (this.timeToPercentage(instance.adjustedStart) > this.currentPercentage) {
          if (
            !nextInstance ||
            this.timeToPercentage(instance.adjustedStart) < this.timeToPercentage(nextInstance.adjustedStart)
          ) {
            nextInstance = instance
          }
        }
      }
    }

    if (nextInstance) {
      this.navigateToInstance(nextInstance)
    }
  }

  navigateToPreviousInstance(): void {
    let previousInstance: Instance | null = null

    for (const group of this.instanceGroup()) {
      for (const instance of group.instances) {
        if (this.timeToPercentage(instance.adjustedStart) < this.currentPercentage) {
          if (
            !previousInstance ||
            this.timeToPercentage(instance.adjustedStart) > this.timeToPercentage(previousInstance.adjustedStart)
          ) {
            previousInstance = instance
          }
        }
      }
    }

    if (previousInstance) {
      this.navigateToInstance(previousInstance)
    }
  }

  private timeToPercentage(time: string): number {
    const totalSeconds = this.parseTimeToSeconds(time)
    const totalTimelineSeconds = this.parseTimeToSeconds(this.videoAnalyzer.videoDuration())
    return (totalSeconds / totalTimelineSeconds) * 100
  }

  private percentageToTime(percentage: number): string {
    const totalSeconds = this.parseTimeToSeconds(this.videoAnalyzer.videoDuration())
    const secondsAtPercentage = (percentage / 100) * totalSeconds
    return this.secondsToTime(secondsAtPercentage)
  }

  private parseTimeToSeconds(time: string): number {
    const [hours, minutes, seconds] = time.split(/[:.]/).map(Number)
    return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0)
  }

  private secondsToTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = Math.floor(totalSeconds % 60)

    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
}
