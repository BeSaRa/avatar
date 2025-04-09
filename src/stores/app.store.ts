import { SpeechTokenContract } from '@/contracts/speech-token-contract'
import { computed, effect } from '@angular/core'
import { getState, patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals'

interface AppStore {
  speechToken: SpeechTokenContract
  streamId: string
  recording: 'Started' | 'InProgress' | 'Stopped'
  streamingStatus: 'Started' | 'InProgress' | 'Stopped' | 'Disconnecting'
  streamReady: boolean
  backgroundColor: string
  backgroundUrl: string
  logoUrl: string
  isVideo: boolean
  preview: boolean
  videoToken: string
  idleAvatar: string
}

const initialState: AppStore = {
  speechToken: {
    token: '',
    region: '',
  },
  streamId: '',
  recording: 'Stopped',
  streamingStatus: 'Stopped',
  streamReady: false,
  backgroundColor: '#8A1538',
  backgroundUrl: 'assets/images/background.svg',
  logoUrl: 'assets/images/qrep-newlogo-colored.png',
  isVideo: false,
  preview: false,
  videoToken: '',
  idleAvatar: '',
}

export const AppStore = signalStore(
  { providedIn: 'root', protectedState: true },
  withState(initialState),
  withComputed(({ streamId, speechToken, recording, streamingStatus, idleAvatar }) => ({
    hasToken: computed(() => !!speechToken().token),
    hasRegion: computed(() => !!speechToken().region),
    isRecordingStarted: computed(() => recording() === 'Started'),
    isRecordingStopped: computed(() => recording() === 'Stopped'),
    isRecordingLoading: computed(() => recording() === 'InProgress'),
    hasStream: computed(() => !!streamId()),
    isStreamStarted: computed(() => streamingStatus() === 'Started'),
    isStreamStopped: computed(() => streamingStatus() === 'Stopped'),
    isStreamLoading: computed(() => streamingStatus() === 'InProgress' || streamingStatus() === 'Disconnecting'),
    idleAvatar: computed(() => idleAvatar()),
    idleAvatarUrl: computed(() => `assets/videos/${idleAvatar()}-idle.webm`),
  })),

  withMethods(store => ({
    updateSpeechToken: (token: SpeechTokenContract = { token: '', region: '' }) => {
      patchState(store, { speechToken: token })
    },
    updateStreamId: (streamId: string) => {
      patchState(store, { streamId })
    },
    recordingStarted: () => {
      patchState(store, { recording: 'Started' })
    },
    recordingStopped: () => {
      patchState(store, { recording: 'Stopped' })
    },
    recordingInProgress: () => {
      patchState(store, { recording: 'InProgress' })
    },
    updateStreamStatus: (status: 'Started' | 'Stopped' | 'InProgress' | 'Disconnecting' = 'Stopped') => {
      patchState(store, { streamingStatus: status, streamId: status === 'Stopped' ? undefined : store.streamId() })
    },
    updateIdleAvatar(idle: string) {
      patchState(store, { idleAvatar: idle })
    },
  })),
  withMethods(store => {
    return {
      updateState(state: Partial<AppStore>) {
        patchState(store, state)
      },
    }
  }),

  withHooks(store => {
    const storageState = sessionStorage.getItem('CURRENT_STATE')
    if (storageState) {
      patchState(store, JSON.parse(storageState))
    } else {
      const state = getState(store)
      sessionStorage.setItem('CURRENT_STATE', JSON.stringify(state))
    }
    return {
      onInit() {
        if (store.isRecordingLoading()) {
          patchState(store, { recording: 'Stopped' })
        }
        effect(() => {
          const state = getState(store)
          sessionStorage.setItem('CURRENT_STATE', JSON.stringify(state))
        })
      },
    }
  })
)
