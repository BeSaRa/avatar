export type VideoIndexerTabType = 'generic' | 'custom'

export type VideoIndexerURLType = 'insights' | 'player'

export type VideoIndexerType = Record<VideoIndexerTabType, Record<VideoIndexerURLType, string>>
