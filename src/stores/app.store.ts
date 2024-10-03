import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals'
import { SpeechTokenContract } from '@/contracts/speech-token-contract'
import { computed } from '@angular/core'

interface AppStore {
  speechToken: SpeechTokenContract
  streamId: string
}

const initialState: AppStore = {
  speechToken: {
    token: '',
    region: '',
  },
  streamId: '',
}

export const AppStore = signalStore(
  { providedIn: 'root', protectedState: true },
  withState(initialState),
  withComputed(({ speechToken }) => ({
    hasToken: computed(() => !!speechToken().token),
    hasRegion: computed(() => !!speechToken().region),
  })),
  withMethods(store => ({
    updateSpeechToken: (token: SpeechTokenContract = { token: '', region: '' }) => {
      patchState(store, { speechToken: token })
    },
    updateStreamId: (streamId: string) => {
      patchState(store, { streamId })
    },
  }))
)
