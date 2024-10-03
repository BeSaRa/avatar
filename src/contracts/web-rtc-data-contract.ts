import { OfferContract } from '@/contracts/offer-contract'
import { IceServerContract } from '@/contracts/ice-server-contract'

export interface WebRtcDataContract {
  iceServers: IceServerContract[]
  offer: OfferContract
}
