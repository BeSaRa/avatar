import {
  Component,
  ElementRef,
  inject,
  OnInit,
  viewChild,
  OnDestroy,
  HostBinding,
  AfterViewInit,
  computed,
} from '@angular/core'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { AvatarService } from '@/services/avatar.service'
import {
  catchError,
  exhaustMap,
  filter,
  from,
  map,
  merge,
  Observable,
  ReplaySubject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs'
import { AsyncPipe, NgClass } from '@angular/common'
import { ignoreErrors } from '@/utils/utils'
import { AppStore } from '@/stores/app.store'

@Component({
  selector: 'app-avatar-video',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  templateUrl: './avatar-video.component.html',
  styleUrl: './avatar-video.component.scss',
})
export class AvatarVideoComponent extends OnDestroyMixin(class {}) implements OnInit, OnDestroy, AfterViewInit {
  @HostBinding('attr.class')
  fullWidth = 'w-full h-full block '
  video = viewChild.required<ElementRef<HTMLVideoElement>>('video')
  idleVideo = viewChild.required<ElementRef<HTMLVideoElement>>('idleVideo')
  avatarService = inject(AvatarService)
  start$ = new ReplaySubject<void>(1)
  stop$ = new ReplaySubject<void>(1)
  declare pc: RTCPeerConnection
  store = inject(AppStore)
  init$: Observable<unknown> = this.start$
    .asObservable()
    .pipe(tap(() => this.store.updateStreamStatus('InProgress')))
    .pipe(takeUntil(this.destroy$))
    .pipe(
      exhaustMap(() =>
        this.avatarService
          .startStream()
          .pipe(
            catchError(err => {
              this.store.updateStreamStatus('Stopped')
              throw err
            })
          )
          .pipe(ignoreErrors())
      )
    )
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
            this.video().nativeElement.play().then()
            this.store.updateStreamStatus('Started')
          }
        })

        this.pc.addEventListener('track', event => {
          this.video().nativeElement.srcObject = event.streams[0]
          event.streams[0].getTracks().forEach(track => {
            track.onmute = () => {
              this.store.updateStreamId('')
            }
          })
        })

        this.store.updateStreamStatus('Started')

        return from(
          this.pc.setRemoteDescription(new RTCSessionDescription(offer as unknown as RTCSessionDescriptionInit))
        )
          .pipe(switchMap(() => from(this.pc.createAnswer())))
          .pipe(switchMap(answer => from(this.pc.setLocalDescription(answer)).pipe(map(() => answer))))
          .pipe(switchMap(answer => this.avatarService.sendAnswer(answer)))
      })
    )
    .pipe(map(() => ''))

  onlineStatus = computed(() => {
    switch (this.store.streamingStatus()) {
      case 'Started':
        return 'متصل'
      case 'InProgress':
        return 'جاري الاتصال'
      default:
        return 'غير متصل'
    }
  })

  async ngOnInit(): Promise<void> {
    // trigger the start of stream
    // this.start$.next()
    // close when destroy component
    merge(this.destroy$)
      .pipe(tap(() => this.store.updateStreamStatus('Stopped')))
      .pipe(switchMap(() => this.avatarService.closeStream().pipe(ignoreErrors())))
      .subscribe()

    this.stop$
      .pipe(filter(() => this.store.hasStream()))
      .pipe(tap(() => this.store.updateStreamStatus('Stopped')))
      .pipe(takeUntil(this.destroy$))
      .pipe(switchMap(() => this.avatarService.closeStream().pipe(ignoreErrors())))
      .subscribe(() => {
        console.log('CLOSED')
      })
  }

  ngAfterViewInit(): void {
    this.playIdle()
  }

  private playIdle(): void {
    this.idleVideo().nativeElement.src = 'assets/videos/idle-full.webm'
    this.idleVideo().nativeElement.muted = true
    this.idleVideo().nativeElement.loop = true
    this.idleVideo().nativeElement.play().then()
  }
}
