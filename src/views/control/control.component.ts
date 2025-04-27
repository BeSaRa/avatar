import { OverlayChatComponent } from '@/components/overlay-chat/overlay-chat.component'
import { ScreenControlComponent } from '@/components/screen-control/screen-control.component'
import { SpinnerLoaderComponent } from '@/components/spinner-loader/spinner-loader.component'
import { ButtonDirective } from '@/directives/button.directive'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { AvatarService } from '@/services/avatar.service'
import { ChatService } from '@/services/chat.service'
import { LocalService } from '@/services/local.service'
import { AppStore } from '@/stores/app.store'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { CommonModule, Location } from '@angular/common'
import { AfterViewInit, Component, inject, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { catchError, finalize, Observable, of, switchMap, tap, timer } from 'rxjs'

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [CommonModule, OverlayChatComponent, ScreenControlComponent, ReactiveFormsModule, ButtonDirective],
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
  animations: [
    trigger('recordButton', [
      state(
        'InProgress',
        style({
          transform: 'scale(1)',
          backgroundColor: 'gray',
        })
      ),
      state(
        'Started',
        style({
          transform: 'scale(1)',
        })
      ),
      state(
        'Stopped',
        style({
          transform: 'scale(0)',
        })
      ),
      transition('* <=> *', [animate('150ms ease-in-out')]),
    ]),
  ],
})
export default class ControlComponent extends OnDestroyMixin(class {}) implements AfterViewInit {
  private readonly _route = inject(ActivatedRoute)
  private readonly _router = inject(Router)
  private readonly _location = inject(Location)
  private readonly _avatarService = inject(AvatarService)
  readonly store = inject(AppStore)
  readonly lang = inject(LocalService)
  readonly chatService = inject(ChatService)

  streamId = new FormControl('', [Validators.required])
  isLoading = false

  text = signal('')

  ngAfterViewInit(): void {
    this.streamId.setValue(this._route.snapshot.queryParamMap.get('streamId'))
    this.store.updateStreamId(this.streamId.value ?? '')
    this._checkStreamId().subscribe()
    this._checkStreamRecursivley().subscribe()
  }

  private _checkStreamId(showLoader = true): Observable<unknown> {
    if (!this.store.hasStream()) return of(null)
    if (showLoader) this.isLoading = true
    return this._avatarService.checkStreamStatus().pipe(
      finalize(() => (this.isLoading = false)),
      catchError(() => {
        this._clearStreamId()
        return of(null)
      })
    )
  }

  private _checkStreamRecursivley(): Observable<unknown> {
    return this._checkStreamId(false).pipe(
      switchMap(() => {
        return timer(60000).pipe(tap(() => this._checkStreamRecursivley().subscribe()))
      })
    )
  }

  private _clearStreamId() {
    this.store.updateStreamId('')
    const currentUrl = this._router.parseUrl(this._router.url)
    currentUrl.queryParams = {}
    this._location.replaceState(currentUrl.toString())
  }

  saveStreamId() {
    this.store.updateStreamId(this.streamId.value ?? '')
    const currentUrl = this._router.parseUrl(this._router.url)
    currentUrl.queryParams = this.streamId.value ? { streamId: this.streamId.value } : {}
    this._location.replaceState(currentUrl.toString())
    this._checkStreamId().subscribe()
  }

  recognizing(value: string) {
    this.text.set(value)
  }
}
