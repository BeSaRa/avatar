import { OverlayChatComponent } from '@/components/overlay-chat/overlay-chat.component'
import { ScreenControlComponent } from '@/components/screen-control/screen-control.component'
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
import { catchError, finalize, Observable, of } from 'rxjs'

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

  clientId = new FormControl('', [Validators.required])
  isLoading = false

  text = signal('')

  ngAfterViewInit(): void {
    this.clientId.setValue(this._route.snapshot.queryParamMap.get('clientId'))
    this.store.updateClientId(this.clientId.value ?? '')
    this._connectStream().subscribe()
    // this._checkStreamRecursivley().subscribe()
  }

  private _connectStream(showLoader = true): Observable<unknown> {
    if (!this.store.clientId()) return of(null)
    if (showLoader) this.isLoading = true
    return this._avatarService.startStream('life-size', true, this.store.clientId()).pipe(
      finalize(() => (this.isLoading = false)),
      catchError(() => {
        this._clearClientId()
        return of(null)
      })
    )
  }

  // private _checkStreamRecursivley(): Observable<unknown> {
  //   return this._checkStreamId(false).pipe(
  //     switchMap(() => {
  //       return timer(60000).pipe(tap(() => this._checkStreamRecursivley().subscribe()))
  //     })
  //   )
  // }

  private _clearClientId() {
    this.store.updateClientId('')
    const currentUrl = this._router.parseUrl(this._router.url)
    currentUrl.queryParams = {}
    this._location.replaceState(currentUrl.toString())
  }

  saveClientId() {
    this.store.updateClientId(this.clientId.value ?? '')
    const currentUrl = this._router.parseUrl(this._router.url)
    currentUrl.queryParams = this.clientId.value ? { clientId: this.clientId.value } : {}
    this._location.replaceState(currentUrl.toString())
    this._connectStream().subscribe()
  }

  recognizing(value: string) {
    this.text.set(value)
  }
}
