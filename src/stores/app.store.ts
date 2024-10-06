import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals'
import { SpeechTokenContract } from '@/contracts/speech-token-contract'
import { computed } from '@angular/core'

interface AppStore {
  speechToken: SpeechTokenContract
  streamId: string
  recording: 'Started' | 'InProgress' | 'Stopped'
  streamReady: boolean
}

const initialState: AppStore = {
  speechToken: {
    token: '',
    region: '',
  },
  streamId: '',
  recording: 'Stopped',
  streamReady: false,
}

export const AppStore = signalStore(
  { providedIn: 'root', protectedState: true },
  withState(initialState),
  withComputed(({ streamId, speechToken, recording }) => ({
    hasToken: computed(() => !!speechToken().token),
    hasRegion: computed(() => !!speechToken().region),
    isRecordingStarted: computed(() => recording() === 'Started'),
    isRecordingStopped: computed(() => recording() === 'Stopped'),
    isRecordingLoading: computed(() => recording() === 'InProgress'),
    hasStream: computed(() => !!streamId()),
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
    updateStreamReady: (ready: boolean) => {
      patchState(store, { streamReady: ready })
    },
  }))
)
