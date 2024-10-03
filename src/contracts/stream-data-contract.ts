import { WebRtcDataContract } from '@/contracts/web-rtc-data-contract'

export interface StreamDataContract {
  id: string
  webrtcData: WebRtcDataContract
}
