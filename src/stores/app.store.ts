import { getState, patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals'
import { SpeechTokenContract } from '@/contracts/speech-token-contract'
import { computed, effect } from '@angular/core'

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
  isInteractiWithChat: boolean
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
  isInteractiWithChat: false,
}

export const AppStore = signalStore(
  { providedIn: 'root', protectedState: true },
  withState(initialState),
  withComputed(({ streamId, speechToken, recording, streamingStatus, isInteractiWithChat }) => ({
    hasToken: computed(() => !!speechToken().token),
    hasRegion: computed(() => !!speechToken().region),
    isRecordingStarted: computed(() => recording() === 'Started'),
    isRecordingStopped: computed(() => recording() === 'Stopped'),
    isRecordingLoading: computed(() => recording() === 'InProgress'),
    hasStream: computed(() => !!streamId()),
    isStreamStarted: computed(() => streamingStatus() === 'Started'),
    isStreamStopped: computed(() => streamingStatus() === 'Stopped'),
    isStreamLoading: computed(() => streamingStatus() === 'InProgress' || streamingStatus() === 'Disconnecting'),
    isInteracted: computed(() => !!isInteractiWithChat()),
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
      patchState(store, { streamingStatus: status })
    },
    updateInteractioinWithChat: (interact: boolean) => {
      patchState(store, { isInteractiWithChat: interact })
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
    const storageState = localStorage.getItem('CURRENT_STATE')
    if (storageState) {
      patchState(store, JSON.parse(storageState))
    } else {
      const state = getState(store)
      localStorage.setItem('CURRENT_STATE', JSON.stringify(state))
      localStorage.removeItem('isInteractiWithChat')
    }
    return {
      onInit() {
        patchState(store, { isInteractiWithChat: false })
        if (store.isRecordingLoading()) {
          patchState(store, { recording: 'Stopped' })
        }
        effect(() => {
          const state = getState(store)
          localStorage.setItem('CURRENT_STATE', JSON.stringify(state))
        })
      },
    }
  })
)
