import { ProcessedKeyFrame, ProcessedScene, ProcessedShot, Scene, Shot } from '@/contracts/insights'
import { LocalService } from '@/services/local.service'
import { timeToSeconds } from '@/utils/insights.utils'
import { NgClass } from '@angular/common'
import { Component, computed, effect, inject, input, signal } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'

@Component({
  selector: 'app-video-insights-scenes',
  standalone: true,
  imports: [NgClass, MatTooltip],
  templateUrl: './video-insights-scenes.component.html',
  styleUrl: './video-insights-scenes.component.scss',
})
export class VideoInsightsScenesComponent {
  lang = inject(LocalService)
  scenes = input.required<Scene[]>()
  shots = input.required<Shot[]>()
  processedScenes = computed(() =>
    this.scenes() && this.shots() ? this.processScenesAndShots(this.scenes(), this.shots()) : []
  )
  selectedScene = signal<ProcessedScene | undefined>(undefined)
  selectedShots = computed(() => this.selectedScene()?.shots ?? [])
  selectedShot = signal<ProcessedShot | undefined>(undefined)
  selectedKeyFrames = computed(() => this.selectedShot()?.keyframes ?? [])
  selectedKeyFrame = signal<ProcessedKeyFrame | undefined>(undefined)

  /**
   *
   */
  constructor() {
    effect(
      () => {
        const scenes = this.processedScenes()
        if (scenes.length) {
          this.selectedScene.set(scenes[0])
        }
      },
      { allowSignalWrites: true }
    )

    effect(
      () => {
        const shots = this.selectedShots()
        if (shots.length) {
          this.selectedShot.set(shots[0])
        }
      },
      { allowSignalWrites: true }
    )

    effect(
      () => {
        const keyFrames = this.selectedKeyFrames()
        if (keyFrames.length) {
          this.selectedKeyFrame.set(keyFrames[0])
        }
      },
      { allowSignalWrites: true }
    )
  }
  private processScenesAndShots(scenes: Scene[], shots: Shot[]): ProcessedScene[] {
    return scenes.map((scene, sceneIndex) => {
      const sceneInstance = scene.instances[0] // `instances` always exists
      const sceneStart = timeToSeconds(sceneInstance.adjustedStart)
      const sceneEnd = timeToSeconds(sceneInstance.adjustedEnd)

      // 🟢 Scene Tooltip Message
      // eslint-disable-next-line max-len
      const sceneTooltip = `Scene #${String(sceneIndex + 1).padStart(2, '0')}; ${sceneInstance.adjustedStart} - ${sceneInstance.adjustedEnd}`

      // Step 1: Filter shots within the scene range
      const shotsInRange = shots.filter(shot => {
        const shotInstance = shot.instances[0] // `instances` always exists
        const shotStart = timeToSeconds(shotInstance.adjustedStart)
        const shotEnd = timeToSeconds(shotInstance.adjustedEnd)

        return (sceneStart <= shotStart && shotStart < sceneEnd) || (sceneStart < shotEnd && shotEnd <= sceneEnd)
      })

      // 🟢 Get the first shot's first keyframe as the scene image
      const firstShot = shotsInRange[0] // Get first shot in range
      const firstKeyFrame = firstShot?.keyFrames?.[0] // First keyframe in first shot
      const firstKeyFrameUrl = firstKeyFrame?.thumbnail_url ?? null

      // Step 2: Collect and map all shots
      const mappedShots = shotsInRange.map((shot, shotIndex) => {
        const shotInstance = shot.instances[0]
        const shotFirstKeyFrame = shot.keyFrames?.[0] // First keyframe in the shot
        const shotImage = shotFirstKeyFrame.thumbnail_url ?? null

        // 🟢 Shot Tooltip Message
        const shotTooltip =
          // eslint-disable-next-line max-len
          `Shot #${String(shotIndex + 1).padStart(2, '0')}; ${shotInstance.adjustedStart} - ${shotInstance.adjustedEnd}` +
          (shot.tags?.length ? ` (${shot.tags.join(', ')})` : '')

        // Step 3: Collect and map all keyframes for the shot
        const mappedKeyFrames =
          shot.keyFrames?.map(keyFrame => {
            const keyFrameInstance = keyFrame.instances?.[0]

            // 🟢 Keyframe Tooltip Message
            const keyFrameTooltip = `KeyFrame: ${keyFrameInstance?.adjustedStart} - ${keyFrameInstance?.adjustedEnd}`

            return {
              id: keyFrame.id,
              image: keyFrame.thumbnail_url,
              instance: keyFrameInstance,
              tooltipMessage: keyFrameTooltip,
            }
          }) ?? []

        return {
          id: shot.id,
          image: shotImage,
          instance: shotInstance,
          tooltipMessage: shotTooltip,
          keyframes: mappedKeyFrames,
        }
      })

      return {
        scene_id: scene.id,
        scene_instance: sceneInstance,
        scene_image: firstKeyFrameUrl,
        shots: mappedShots,
        tooltipMessage: sceneTooltip, // Scene tooltip message
      }
    })
  }
}
