// eslint-disable-next-line max-len
import { VideoInsightsAudioEffectsComponent } from '@/components/insights/video-insights-audio-effects/video-insights-audio-effects.component'
// eslint-disable-next-line max-len
import { VideoInsightsEmotionsComponent } from '@/components/insights/video-insights-emotions/video-insights-emotions.component'
// eslint-disable-next-line max-len
import { VideoInsightsLabelsComponent } from '@/components/insights/video-insights-labels/video-insights-labels.component'
// eslint-disable-next-line max-len
import { VideoInsightsNamedEntitiesComponent } from '@/components/insights/video-insights-named-entities/video-insights-named-entities.component'
// eslint-disable-next-line max-len
import { VideoInsightsObservedPeopleComponent } from '@/components/insights/video-insights-observed-people/video-insights-observed-people.component'
// eslint-disable-next-line max-len
import { VideoInsightsPeopleComponent } from '@/components/insights/video-insights-people/video-insights-people.component'
// eslint-disable-next-line max-len
import { VideoInsightsScenesComponent } from '@/components/insights/video-insights-scenes/video-insights-scenes.component'
// eslint-disable-next-line max-len
import { VideoInsightsTopicsComponent } from '@/components/insights/video-insights-topics/video-insights-topics.component'
import { TailwindColorWithShade } from '@/types/tailwind-colors-type'
import { InputSignal } from '@angular/core'
export interface InsightsContract {
  partition?: unknown
  description?: string
  privacyMode: string
  state: string
  accountId: string
  id: string
  name: string
  userName: string
  created: string | Date
  isOwned: boolean
  isEditable: boolean
  isBase: boolean
  durationInSeconds: number
  duration: string
  summarizedInsights: SummarizedInsights
  videos: Video[]
  videosRanges: VideosRange[]
}

interface TimeRange {
  startTime: string
  endTime: string
  startSeconds: number
  endSeconds: number
}

interface Duration {
  time: string
  seconds: number
}

type AppearanceKey = 'apperances' | 'instances'

type Appearance<T extends TimeRange | Instance> = {
  [K in AppearanceKey as T extends Instance ? 'instances' : 'appearances']: T[]
}

export interface Instance {
  adjustedStart: string
  adjustedEnd: string
  start: string
  end: string
}

export interface InstanceGroup {
  instanceColor?: `fill-${TailwindColorWithShade}`
  instanceTooltipColor?: `bg-${TailwindColorWithShade}`
  instances: Instance[]
}

export interface Clothing {
  id: number
  type: string
  properties?: Record<string, string>
}
export interface MatchingFace {
  id: number
  confidence: number
}
export interface ObservedPeople extends Appearance<Instance> {
  id: number
  thumbnailId: string
  thumbnail_url?: string
  clothing?: Clothing[]
  appearancePercentage?: number
  clothingList?: string[]
  matchingFace?: MatchingFace
}
export interface Face extends Appearance<Instance & { thumbnailsIds: string[] }> {
  videoId: string
  confidence: number
  description?: string | null
  title?: string | null
  imageUrl?: string | null
  thumbnailId: string
  seenDuration: number
  seenDurationRatio: number
  id: number
  name?: string
  thumbnails: FaceThumbnails[]
  highQuality: boolean
  referenceType: string
  referenceId: string
  thumbnail_url: string
}

interface FaceThumbnails extends Appearance<Instance> {
  id: string
  fileName: string
}

interface Sentiment extends Appearance<TimeRange> {
  sentimentKey: string
  seenDurationRatio: number
}

export interface Label extends Appearance<Instance & { confidence: number }> {
  id: number
  name: string
  referenceId?: string
  language: string
}

export interface NamedPeople extends Appearance<Instance & { instanceSource: string }> {
  id: number
  name: string
  referenceId: string | null
  referenceUrl: string | null
  description: string | null
  tags: string[]
  confidence: number
  isCustom: boolean
}

export interface NamedLocation extends Appearance<Instance & { instanceSource: string }> {
  id: number
  name: string
  referenceId: string | null
  referenceUrl: string | null
  description: string | null
  tags: string[]
  confidence: number
  isCustom: boolean
}

export interface TopicGroupList {
  groupName: string | null
  groupId: number | null
  children: { name: string; id: number }[]
  isParentClickable: boolean
}

export interface Topic extends Appearance<Instance> {
  referenceUrl?: string | null
  referenceId: string
  referenceType: string
  iptcName?: string
  iabName: string | null
  confidence: number
  language: string
  id: number
  name: string
  topicList?: TopicGroupList[]
}

export interface Transcript extends Appearance<Instance> {
  id: number
  text: string
  confidence: number
  speakerId: number
  language: string
}

export interface ProcessedKeyFrame {
  id: number
  image: string | null
  instance: Unpacked<KeyFrame['instances']>
  tooltipMessage: string
}

type Unpacked<T> = T extends (infer U)[] ? U : never

export interface ProcessedShot {
  id: number
  image: string | null
  instance: Unpacked<Shot['instances']>
  tooltipMessage: string
  keyframes: ProcessedKeyFrame[]
}

export interface ProcessedScene {
  scene_id: number
  scene_instance: Unpacked<Scene['instances']>
  scene_image: string | null
  shots: ProcessedShot[]
  tooltipMessage: string
}

export interface Scene extends Appearance<Instance> {
  id: number
}

export interface Shot extends Appearance<Instance> {
  id: number
  tags?: string[]
  keyFrames: KeyFrame[]
}

export interface KeyFrame extends Appearance<Instance & { thumbnail_url: string }> {
  id: number
  thumbnail_url: string
}

interface Speaker extends Appearance<Instance> {
  id: number
  name: string
}

interface TextualContentModeration extends Appearance<Instance> {
  id: number
  bannedWordsCount: number
  bannedWordsRatio: number
}

interface TextBlock extends Appearance<Instance> {
  id: number
}

interface VideoStatistics {
  correspondenceCount: number
  speakerTalkToListenRatio: Record<string, number>
  speakerLongestMonolog: Record<string, number>
  speakerNumberOfFragments: Record<string, number>
  speakerWordCount: Record<string, number>
}

export interface VideoInsights {
  version: string
  duration: string
  sourceLanguage: string
  sourceLanguages: string[]
  language: string
  languages: string[]
  transcript: Transcript[]
  topics?: Topic[]
  faces?: Face[]
  observedPeople?: ObservedPeople[]
  labels?: Label[]
  scenes: Scene[]
  shots: Shot[]
  emotions?: Emotion[]
  audioEffects?: AudioEffect[]
  brands?: Brand[]
  namedPeople?: NamedPeople[]
  namedLocations?: NamedLocation[]
  sentiments: Sentiment[]
  blocks: TextBlock[]
  speakers: Speaker[]
  textualContentModeration: TextualContentModeration
  statistics: VideoStatistics
  sourceLanguageConfidence: number
  thumbnailId: string
  width: number
  height: number
  detectSourceLanguage: boolean
  languageAutoDetectMode: string
  indexingPreset: string
  streamingPreset: string
  linguisticModelId: string
  personModelId: string
  logoGroupId?: string | null
  isAdult: boolean
  excludedAIs: string[]
  isSearchable: boolean
  publishedUrl: string
  publishedProxyUrl?: string | null
  viewToken?: string | null
}

export type EmotionType = 'Anger' | 'Fear' | 'Joy' | 'Neutral' | 'Sad'

export interface Emotion extends Appearance<Instance & { confidence: number }> {
  id: number
  type: EmotionType
}

export interface AudioEffect extends Appearance<Instance & { confidence: number }> {
  id: number
  type: string
}

export interface Brand extends Appearance<Instance & { brandType: string; instanceSource: string }> {
  id: number
  referenceType: string
  name: string
  referenceId: string | null
  referenceUrl: string | null
  description: string | null
  tags: string[]
  confidence: number
  isCustom: boolean
}

interface Video {
  accountId: string
  id: string
  state: string
  moderationState: string
  reviewState: string
  privacyMode: string
  processingProgress: string
  failureMessage?: string
  externalId?: string | null
  externalUrl?: string | null
  metadata?: Record<string, unknown> | null
  insights: VideoInsights
}

interface SummarizedInsights {
  name: string
  id: string
  privacyMode: string
  duration: Duration
  thumbnailVideoId: string
  thumbnailId: string
  faces: Face[]
  keywords: string[]
  sentiments: Sentiment[]
  emotions: Emotion[]
  audioEffects: AudioEffect[]
  labels: Label[]
  framePatterns: string[]
  brands: string[]
  namedLocations: string[]
  namedPeople: NamedPeople[]
  statistics: VideoStatistics
  topics: Topic[]
}

interface VideosRange {
  videoId: string
  range: VideoRange
}

interface VideoRange {
  start: string
  end: string
}

type NonNever<T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends never ? never : K
  }[keyof T]
>
export type InputProps<T> = NonNever<{
  [K in keyof T]: T[K] extends InputSignal<infer R> ? (InputSignal<R> extends T[K] ? R : never) : never
}>

// Enum to define configuration keys
export enum InsightComponentKey {
  People = 'people',
  ObservedPeople = 'observedPeople',
  Topics = 'topics',
  Emotions = 'emotions',
  AudioEffects = 'audioEffects',
  Labels = 'labels',
  NamedEntities = 'namedEntities',
  Scenes = 'scenes',
}

type InsightsComponents =
  | VideoInsightsPeopleComponent
  | VideoInsightsObservedPeopleComponent
  | VideoInsightsTopicsComponent
  | VideoInsightsEmotionsComponent
  | VideoInsightsAudioEffectsComponent
  | VideoInsightsLabelsComponent
  | VideoInsightsNamedEntitiesComponent
  | VideoInsightsScenesComponent

export interface InsightsComponentsConfig<T extends InsightsComponents> {
  component: new () => T
  inputs: InputProps<T>
  show: boolean
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type InsightConfigMap = {
  [InsightComponentKey.People]: InsightsComponentsConfig<VideoInsightsPeopleComponent>
  [InsightComponentKey.ObservedPeople]: InsightsComponentsConfig<VideoInsightsObservedPeopleComponent>
  [InsightComponentKey.Topics]: InsightsComponentsConfig<VideoInsightsTopicsComponent>
  [InsightComponentKey.Emotions]: InsightsComponentsConfig<VideoInsightsEmotionsComponent>
  [InsightComponentKey.AudioEffects]: InsightsComponentsConfig<VideoInsightsAudioEffectsComponent>
  [InsightComponentKey.Labels]: InsightsComponentsConfig<VideoInsightsLabelsComponent>
  [InsightComponentKey.NamedEntities]: InsightsComponentsConfig<VideoInsightsNamedEntitiesComponent>
  [InsightComponentKey.Scenes]: InsightsComponentsConfig<VideoInsightsScenesComponent>
}
