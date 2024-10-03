import { Component, ElementRef, inject, OnInit, viewChild, OnDestroy, HostBinding } from '@angular/core'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { AvatarService } from '@/services/avatar.service'
import { from, map, merge, Observable, ReplaySubject, switchMap, takeUntil } from 'rxjs'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'app-avatar-video',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './avatar-video.component.html',
  styleUrl: './avatar-video.component.scss',
})
export class AvatarVideoComponent extends OnDestroyMixin(class {}) implements OnInit, OnDestroy {
  @HostBinding('attr.class')
  fullWidth = 'w-full h-full block '
  video = viewChild.required<ElementRef<HTMLVideoElement>>('video')
  avatarService = inject(AvatarService)
  start$ = new ReplaySubject<void>(1)
  declare pc: RTCPeerConnection
  init$: Observable<unknown> = this.start$
    .asObservable()
    .pipe(takeUntil(this.destroy$))
    .pipe(switchMap(() => this.avatarService.startStream()))
    .pipe(
      switchMap(response => {
        const {
          data: {
            webrtcData: { offer, iceServers },
          },
        } = response

        this.pc = new RTCPeerConnection({
          iceServers,
          iceTransportPolicy: 'relay',
        })
        this.pc.addEventListener('icecandidate', event => {
          if (event.candidate) {
            this.avatarService.sendCandidate(event.candidate).subscribe()
          }
        })

        this.pc.addEventListener('icegatheringstatechange', event => {
          if (
            (event.target as unknown as RTCPeerConnection).iceGatheringState == 'complete' &&
            this.video().nativeElement.paused
          ) {
            console.log('icegatheringstatechange')
            this.video().nativeElement.play().then()
          }
        })

        this.pc.addEventListener('track', event => {
          console.log('track', event)
          this.video().nativeElement.srcObject = event.streams[0]
        })

        return from(
          this.pc.setRemoteDescription(new RTCSessionDescription(offer as unknown as RTCSessionDescriptionInit))
        )
          .pipe(switchMap(() => from(this.pc.createAnswer())))
          .pipe(switchMap(answer => from(this.pc.setLocalDescription(answer)).pipe(map(() => answer))))
          .pipe(switchMap(answer => this.avatarService.sendAnswer(answer)))
      })
    )
    .pipe(map(() => ''))

  async ngOnInit(): Promise<void> {
    // trigger the start of stream
    this.start$.next()

    // close when destroy component
    merge(this.destroy$)
      .pipe(switchMap(() => this.avatarService.closeStream()))
      .subscribe()
  }

  async fullScreen() {
    this.video().nativeElement.parentElement?.requestFullscreen()
  }
}
