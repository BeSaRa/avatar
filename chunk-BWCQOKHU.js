import{$ as Dt,A as Z,C as K,_ as X,a as bt,aa as At,ca as C,da as D,e as N,ea as Ot,fa as $,g as V,ga as v,i as U,ia as g,la as q,r as z,s as G,x as H,z as Ct}from"./chunk-5KZC7AJR.js";import{$b as pt,Ac as P,Cb as S,G as T,Gb as j,Ia as p,Ib as dt,Jb as M,L as rt,La as lt,M as b,Ma as R,Mb as ht,Qa as F,Rc as vt,S as I,Ub as mt,Vb as ut,Wa as W,a as h,b as nt,ca as x,cd as B,gd as yt,ja as w,ka as k,kc as gt,lc as ft,ma as u,mc as _t,oa as c,ob as l,pa as f,q as m,qb as ct,ta as E,ua as L,x as st}from"./chunk-3HGC4AVX.js";function St(a,o){}var _=class{constructor(){this.role="dialog",this.panelClass="",this.hasBackdrop=!0,this.backdropClass="",this.disableClose=!1,this.width="",this.height="",this.data=null,this.ariaDescribedBy=null,this.ariaLabelledBy=null,this.ariaLabel=null,this.ariaModal=!0,this.autoFocus="first-tabbable",this.restoreFocus=!0,this.closeOnNavigation=!0,this.closeOnDestroy=!0,this.closeOnOverlayDetachments=!0}};var et=(()=>{class a extends At{constructor(t,e,i,n,r,s,d,y){super(),this._elementRef=t,this._focusTrapFactory=e,this._config=n,this._interactivityChecker=r,this._ngZone=s,this._overlayRef=d,this._focusMonitor=y,this._platform=f(bt),this._focusTrap=null,this._elementFocusedBeforeDialogWasOpened=null,this._closeInteractionType=null,this._ariaLabelledByQueue=[],this._changeDetectorRef=f(vt),this._injector=f(p),this._isDestroyed=!1,this.attachDomPortal=Q=>{this._portalOutlet.hasAttached();let Et=this._portalOutlet.attachDomPortal(Q);return this._contentAttached(),Et},this._document=i,this._config.ariaLabelledBy&&this._ariaLabelledByQueue.push(this._config.ariaLabelledBy)}_addAriaLabelledBy(t){this._ariaLabelledByQueue.push(t),this._changeDetectorRef.markForCheck()}_removeAriaLabelledBy(t){let e=this._ariaLabelledByQueue.indexOf(t);e>-1&&(this._ariaLabelledByQueue.splice(e,1),this._changeDetectorRef.markForCheck())}_contentAttached(){this._initializeFocusTrap(),this._handleBackdropClicks(),this._captureInitialFocus()}_captureInitialFocus(){this._trapFocus()}ngOnDestroy(){this._isDestroyed=!0,this._restoreFocus()}attachComponentPortal(t){this._portalOutlet.hasAttached();let e=this._portalOutlet.attachComponentPortal(t);return this._contentAttached(),e}attachTemplatePortal(t){this._portalOutlet.hasAttached();let e=this._portalOutlet.attachTemplatePortal(t);return this._contentAttached(),e}_recaptureFocus(){this._containsFocus()||this._trapFocus()}_forceFocus(t,e){this._interactivityChecker.isFocusable(t)||(t.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let i=()=>{t.removeEventListener("blur",i),t.removeEventListener("mousedown",i),t.removeAttribute("tabindex")};t.addEventListener("blur",i),t.addEventListener("mousedown",i)})),t.focus(e)}_focusByCssSelector(t,e){let i=this._elementRef.nativeElement.querySelector(t);i&&this._forceFocus(i,e)}_trapFocus(){this._isDestroyed||dt(()=>{let t=this._elementRef.nativeElement;switch(this._config.autoFocus){case!1:case"dialog":this._containsFocus()||t.focus();break;case!0:case"first-tabbable":this._focusTrap?.focusInitialElement()||this._focusDialogContainer();break;case"first-heading":this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');break;default:this._focusByCssSelector(this._config.autoFocus);break}},{injector:this._injector})}_restoreFocus(){let t=this._config.restoreFocus,e=null;if(typeof t=="string"?e=this._document.querySelector(t):typeof t=="boolean"?e=t?this._elementFocusedBeforeDialogWasOpened:null:t&&(e=t),this._config.restoreFocus&&e&&typeof e.focus=="function"){let i=N(),n=this._elementRef.nativeElement;(!i||i===this._document.body||i===n||n.contains(i))&&(this._focusMonitor?(this._focusMonitor.focusVia(e,this._closeInteractionType),this._closeInteractionType=null):e.focus())}this._focusTrap&&this._focusTrap.destroy()}_focusDialogContainer(){this._elementRef.nativeElement.focus&&this._elementRef.nativeElement.focus()}_containsFocus(){let t=this._elementRef.nativeElement,e=N();return t===e||t.contains(e)}_initializeFocusTrap(){this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._document&&(this._elementFocusedBeforeDialogWasOpened=N()))}_handleBackdropClicks(){this._overlayRef.backdropClick().subscribe(()=>{this._config.disableClose&&this._recaptureFocus()})}static{this.\u0275fac=function(e){return new(e||a)(l(F),l(G),l(B,8),l(_),l(z),l(R),l(v),l(H))}}static{this.\u0275cmp=E({type:a,selectors:[["cdk-dialog-container"]],viewQuery:function(e,i){if(e&1&&gt(C,7),e&2){let n;ft(n=_t())&&(i._portalOutlet=n.first)}},hostAttrs:["tabindex","-1",1,"cdk-dialog-container"],hostVars:6,hostBindings:function(e,i){e&2&&M("id",i._config.id||null)("role",i._config.role)("aria-modal",i._config.ariaModal)("aria-labelledby",i._config.ariaLabel?null:i._ariaLabelledByQueue[0])("aria-label",i._config.ariaLabel)("aria-describedby",i._config.ariaDescribedBy||null)},standalone:!0,features:[S,P],decls:1,vars:0,consts:[["cdkPortalOutlet",""]],template:function(e,i){e&1&&j(0,St,0,0,"ng-template",0)},dependencies:[C],styles:[".cdk-dialog-container{display:block;width:100%;height:100%;min-height:inherit;max-height:inherit}"],encapsulation:2})}}return a})(),A=class{constructor(o,t){this.overlayRef=o,this.config=t,this.closed=new m,this.disableClose=t.disableClose,this.backdropClick=o.backdropClick(),this.keydownEvents=o.keydownEvents(),this.outsidePointerEvents=o.outsidePointerEvents(),this.id=t.id,this.keydownEvents.subscribe(e=>{e.keyCode===27&&!this.disableClose&&!V(e)&&(e.preventDefault(),this.close(void 0,{focusOrigin:"keyboard"}))}),this.backdropClick.subscribe(()=>{this.disableClose||this.close(void 0,{focusOrigin:"mouse"})}),this._detachSubscription=o.detachments().subscribe(()=>{t.closeOnOverlayDetachments!==!1&&this.close()})}close(o,t){if(this.containerInstance){let e=this.closed;this.containerInstance._closeInteractionType=t?.focusOrigin||"program",this._detachSubscription.unsubscribe(),this.overlayRef.dispose(),e.next(o),e.complete(),this.componentInstance=this.containerInstance=null}}updatePosition(){return this.overlayRef.updatePosition(),this}updateSize(o="",t=""){return this.overlayRef.updateSize({width:o,height:t}),this}addPanelClass(o){return this.overlayRef.addPanelClass(o),this}removePanelClass(o){return this.overlayRef.removePanelClass(o),this}},jt=new u("DialogScrollStrategy",{providedIn:"root",factory:()=>{let a=f(g);return()=>a.scrollStrategies.block()}}),Mt=new u("DialogData"),Pt=new u("DefaultDialogConfig");var Bt=0,it=(()=>{class a{get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}constructor(t,e,i,n,r,s){this._overlay=t,this._injector=e,this._defaultOptions=i,this._parentDialog=n,this._overlayContainer=r,this._openDialogsAtThisLevel=[],this._afterAllClosedAtThisLevel=new m,this._afterOpenedAtThisLevel=new m,this._ariaHiddenElements=new Map,this.afterAllClosed=T(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(x(void 0))),this._scrollStrategy=s}open(t,e){let i=this._defaultOptions||new _;e=h(h({},i),e),e.id=e.id||`cdk-dialog-${Bt++}`,e.id&&this.getDialogById(e.id);let n=this._getOverlayConfig(e),r=this._overlay.create(n),s=new A(r,e),d=this._attachContainer(r,s,e);return s.containerInstance=d,this._attachDialogContent(t,s,d,e),this.openDialogs.length||this._hideNonDialogContentFromAssistiveTechnology(),this.openDialogs.push(s),s.closed.subscribe(()=>this._removeOpenDialog(s,!0)),this.afterOpened.next(s),s}closeAll(){J(this.openDialogs,t=>t.close())}getDialogById(t){return this.openDialogs.find(e=>e.id===t)}ngOnDestroy(){J(this._openDialogsAtThisLevel,t=>{t.config.closeOnDestroy===!1&&this._removeOpenDialog(t,!1)}),J(this._openDialogsAtThisLevel,t=>t.close()),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete(),this._openDialogsAtThisLevel=[]}_getOverlayConfig(t){let e=new Ot({positionStrategy:t.positionStrategy||this._overlay.position().global().centerHorizontally().centerVertically(),scrollStrategy:t.scrollStrategy||this._scrollStrategy(),panelClass:t.panelClass,hasBackdrop:t.hasBackdrop,direction:t.direction,minWidth:t.minWidth,minHeight:t.minHeight,maxWidth:t.maxWidth,maxHeight:t.maxHeight,width:t.width,height:t.height,disposeOnNavigation:t.closeOnNavigation});return t.backdropClass&&(e.backdropClass=t.backdropClass),e}_attachContainer(t,e,i){let n=i.injector||i.viewContainerRef?.injector,r=[{provide:_,useValue:i},{provide:A,useValue:e},{provide:v,useValue:t}],s;i.container?typeof i.container=="function"?s=i.container:(s=i.container.type,r.push(...i.container.providers(i))):s=et;let d=new X(s,i.viewContainerRef,p.create({parent:n||this._injector,providers:r}),i.componentFactoryResolver);return t.attach(d).instance}_attachDialogContent(t,e,i,n){if(t instanceof ct){let r=this._createInjector(n,e,i,void 0),s={$implicit:n.data,dialogRef:e};n.templateContext&&(s=h(h({},s),typeof n.templateContext=="function"?n.templateContext():n.templateContext)),i.attachTemplatePortal(new Dt(t,null,s,r))}else{let r=this._createInjector(n,e,i,this._injector),s=i.attachComponentPortal(new X(t,n.viewContainerRef,r,n.componentFactoryResolver));e.componentRef=s,e.componentInstance=s.instance}}_createInjector(t,e,i,n){let r=t.injector||t.viewContainerRef?.injector,s=[{provide:Mt,useValue:t.data},{provide:A,useValue:e}];return t.providers&&(typeof t.providers=="function"?s.push(...t.providers(e,t,i)):s.push(...t.providers)),t.direction&&(!r||!r.get(Z,null,{optional:!0}))&&s.push({provide:Z,useValue:{value:t.direction,change:st()}}),p.create({parent:r||n,providers:s})}_removeOpenDialog(t,e){let i=this.openDialogs.indexOf(t);i>-1&&(this.openDialogs.splice(i,1),this.openDialogs.length||(this._ariaHiddenElements.forEach((n,r)=>{n?r.setAttribute("aria-hidden",n):r.removeAttribute("aria-hidden")}),this._ariaHiddenElements.clear(),e&&this._getAfterAllClosed().next()))}_hideNonDialogContentFromAssistiveTechnology(){let t=this._overlayContainer.getContainerElement();if(t.parentElement){let e=t.parentElement.children;for(let i=e.length-1;i>-1;i--){let n=e[i];n!==t&&n.nodeName!=="SCRIPT"&&n.nodeName!=="STYLE"&&!n.hasAttribute("aria-live")&&(this._ariaHiddenElements.set(n,n.getAttribute("aria-hidden")),n.setAttribute("aria-hidden","true"))}}}_getAfterAllClosed(){let t=this._parentDialog;return t?t._getAfterAllClosed():this._afterAllClosedAtThisLevel}static{this.\u0275fac=function(e){return new(e||a)(c(g),c(p),c(Pt,8),c(a,12),c($),c(jt))}}static{this.\u0275prov=w({token:a,factory:a.\u0275fac,providedIn:"root"})}}return a})();function J(a,o){let t=a.length;for(;t--;)o(a[t])}var Tt=(()=>{class a{static{this.\u0275fac=function(e){return new(e||a)}}static{this.\u0275mod=L({type:a})}static{this.\u0275inj=k({providers:[it],imports:[q,D,Ct,D]})}}return a})();function Nt(a,o){}var O=class{constructor(){this.role="dialog",this.panelClass="",this.hasBackdrop=!0,this.backdropClass="",this.disableClose=!1,this.width="",this.height="",this.data=null,this.ariaDescribedBy=null,this.ariaLabelledBy=null,this.ariaLabel=null,this.ariaModal=!0,this.autoFocus="first-tabbable",this.restoreFocus=!0,this.delayFocusTrap=!0,this.closeOnNavigation=!0}},at="mdc-dialog--open",It="mdc-dialog--opening",xt="mdc-dialog--closing",Vt=150,zt=75,Gt=(()=>{class a extends et{constructor(t,e,i,n,r,s,d,y,Q){super(t,e,i,n,r,s,d,Q),this._animationMode=y,this._animationStateChanged=new lt,this._animationsEnabled=this._animationMode!=="NoopAnimations",this._actionSectionCount=0,this._hostElement=this._elementRef.nativeElement,this._enterAnimationDuration=this._animationsEnabled?kt(this._config.enterAnimationDuration)??Vt:0,this._exitAnimationDuration=this._animationsEnabled?kt(this._config.exitAnimationDuration)??zt:0,this._animationTimer=null,this._finishDialogOpen=()=>{this._clearAnimationClasses(),this._openAnimationDone(this._enterAnimationDuration)},this._finishDialogClose=()=>{this._clearAnimationClasses(),this._animationStateChanged.emit({state:"closed",totalTime:this._exitAnimationDuration})}}_contentAttached(){super._contentAttached(),this._startOpenAnimation()}_startOpenAnimation(){this._animationStateChanged.emit({state:"opening",totalTime:this._enterAnimationDuration}),this._animationsEnabled?(this._hostElement.style.setProperty(wt,`${this._enterAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(It,at)),this._waitForAnimationToComplete(this._enterAnimationDuration,this._finishDialogOpen)):(this._hostElement.classList.add(at),Promise.resolve().then(()=>this._finishDialogOpen()))}_startExitAnimation(){this._animationStateChanged.emit({state:"closing",totalTime:this._exitAnimationDuration}),this._hostElement.classList.remove(at),this._animationsEnabled?(this._hostElement.style.setProperty(wt,`${this._exitAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(xt)),this._waitForAnimationToComplete(this._exitAnimationDuration,this._finishDialogClose)):Promise.resolve().then(()=>this._finishDialogClose())}_updateActionSectionCount(t){this._actionSectionCount+=t,this._changeDetectorRef.markForCheck()}_clearAnimationClasses(){this._hostElement.classList.remove(It,xt)}_waitForAnimationToComplete(t,e){this._animationTimer!==null&&clearTimeout(this._animationTimer),this._animationTimer=setTimeout(e,t)}_requestAnimationFrame(t){this._ngZone.runOutsideAngular(()=>{typeof requestAnimationFrame=="function"?requestAnimationFrame(t):t()})}_captureInitialFocus(){this._config.delayFocusTrap||this._trapFocus()}_openAnimationDone(t){this._config.delayFocusTrap&&this._trapFocus(),this._animationStateChanged.next({state:"opened",totalTime:t})}ngOnDestroy(){super.ngOnDestroy(),this._animationTimer!==null&&clearTimeout(this._animationTimer)}attachComponentPortal(t){let e=super.attachComponentPortal(t);return e.location.nativeElement.classList.add("mat-mdc-dialog-component-host"),e}static{this.\u0275fac=function(e){return new(e||a)(l(F),l(G),l(B,8),l(O),l(z),l(R),l(v),l(W,8),l(H))}}static{this.\u0275cmp=E({type:a,selectors:[["mat-dialog-container"]],hostAttrs:["tabindex","-1",1,"mat-mdc-dialog-container","mdc-dialog"],hostVars:10,hostBindings:function(e,i){e&2&&(pt("id",i._config.id),M("aria-modal",i._config.ariaModal)("role",i._config.role)("aria-labelledby",i._config.ariaLabel?null:i._ariaLabelledByQueue[0])("aria-label",i._config.ariaLabel)("aria-describedby",i._config.ariaDescribedBy||null),ht("_mat-animation-noopable",!i._animationsEnabled)("mat-mdc-dialog-container-with-actions",i._actionSectionCount>0))},standalone:!0,features:[S,P],decls:3,vars:0,consts:[[1,"mat-mdc-dialog-inner-container","mdc-dialog__container"],[1,"mat-mdc-dialog-surface","mdc-dialog__surface"],["cdkPortalOutlet",""]],template:function(e,i){e&1&&(mt(0,"div",0)(1,"div",1),j(2,Nt,0,0,"ng-template",2),ut()())},dependencies:[C],styles:['.mat-mdc-dialog-container{width:100%;height:100%;display:block;box-sizing:border-box;max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit;outline:0}.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-max-width, 80vw);min-width:var(--mat-dialog-container-min-width, 0)}@media(max-width: 599px){.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-small-max-width, 80vw)}}.mat-mdc-dialog-inner-container{display:flex;flex-direction:row;align-items:center;justify-content:space-around;box-sizing:border-box;height:100%;opacity:0;transition:opacity linear var(--mat-dialog-transition-duration, 0ms);max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit}.mdc-dialog--closing .mat-mdc-dialog-inner-container{transition:opacity 75ms linear;transform:none}.mdc-dialog--open .mat-mdc-dialog-inner-container{opacity:1}._mat-animation-noopable .mat-mdc-dialog-inner-container{transition:none}.mat-mdc-dialog-surface{display:flex;flex-direction:column;flex-grow:0;flex-shrink:0;box-sizing:border-box;width:100%;height:100%;position:relative;overflow-y:auto;outline:0;transform:scale(0.8);transition:transform var(--mat-dialog-transition-duration, 0ms) cubic-bezier(0, 0, 0.2, 1);max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit;box-shadow:var(--mat-dialog-container-elevation-shadow, 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12));border-radius:var(--mdc-dialog-container-shape, var(--mat-app-corner-extra-large, 4px));background-color:var(--mdc-dialog-container-color, var(--mat-app-surface, white))}[dir=rtl] .mat-mdc-dialog-surface{text-align:right}.mdc-dialog--open .mat-mdc-dialog-surface,.mdc-dialog--closing .mat-mdc-dialog-surface{transform:none}._mat-animation-noopable .mat-mdc-dialog-surface{transition:none}.mat-mdc-dialog-surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:2px solid rgba(0,0,0,0);border-radius:inherit;content:"";pointer-events:none}.mat-mdc-dialog-title{display:block;position:relative;flex-shrink:0;box-sizing:border-box;margin:0 0 1px;padding:var(--mat-dialog-headline-padding, 0 24px 9px)}.mat-mdc-dialog-title::before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}[dir=rtl] .mat-mdc-dialog-title{text-align:right}.mat-mdc-dialog-container .mat-mdc-dialog-title{color:var(--mdc-dialog-subhead-color, var(--mat-app-on-surface, rgba(0, 0, 0, 0.87)));font-family:var(--mdc-dialog-subhead-font, var(--mat-app-headline-small-font, inherit));line-height:var(--mdc-dialog-subhead-line-height, var(--mat-app-headline-small-line-height, 1.5rem));font-size:var(--mdc-dialog-subhead-size, var(--mat-app-headline-small-size, 1rem));font-weight:var(--mdc-dialog-subhead-weight, var(--mat-app-headline-small-weight, 400));letter-spacing:var(--mdc-dialog-subhead-tracking, var(--mat-app-headline-small-tracking, 0.03125em))}.mat-mdc-dialog-content{display:block;flex-grow:1;box-sizing:border-box;margin:0;overflow:auto;max-height:65vh}.mat-mdc-dialog-content>:first-child{margin-top:0}.mat-mdc-dialog-content>:last-child{margin-bottom:0}.mat-mdc-dialog-container .mat-mdc-dialog-content{color:var(--mdc-dialog-supporting-text-color, var(--mat-app-on-surface-variant, rgba(0, 0, 0, 0.6)));font-family:var(--mdc-dialog-supporting-text-font, var(--mat-app-body-medium-font, inherit));line-height:var(--mdc-dialog-supporting-text-line-height, var(--mat-app-body-medium-line-height, 1.5rem));font-size:var(--mdc-dialog-supporting-text-size, var(--mat-app-body-medium-size, 1rem));font-weight:var(--mdc-dialog-supporting-text-weight, var(--mat-app-body-medium-weight, 400));letter-spacing:var(--mdc-dialog-supporting-text-tracking, var(--mat-app-body-medium-tracking, 0.03125em))}.mat-mdc-dialog-container .mat-mdc-dialog-content{padding:var(--mat-dialog-content-padding, 20px 24px)}.mat-mdc-dialog-container-with-actions .mat-mdc-dialog-content{padding:var(--mat-dialog-with-actions-content-padding, 20px 24px)}.mat-mdc-dialog-container .mat-mdc-dialog-title+.mat-mdc-dialog-content{padding-top:0}.mat-mdc-dialog-actions{display:flex;position:relative;flex-shrink:0;flex-wrap:wrap;align-items:center;justify-content:flex-end;box-sizing:border-box;min-height:52px;margin:0;padding:8px;border-top:1px solid rgba(0,0,0,0);padding:var(--mat-dialog-actions-padding, 8px);justify-content:var(--mat-dialog-actions-alignment, start)}.cdk-high-contrast-active .mat-mdc-dialog-actions{border-top-color:CanvasText}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-start,.mat-mdc-dialog-actions[align=start]{justify-content:start}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-center,.mat-mdc-dialog-actions[align=center]{justify-content:center}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-end,.mat-mdc-dialog-actions[align=end]{justify-content:flex-end}.mat-mdc-dialog-actions .mat-button-base+.mat-button-base,.mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-mdc-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}.mat-mdc-dialog-component-host{display:contents}'],encapsulation:2})}}return a})(),wt="--mat-dialog-transition-duration";function kt(a){return a==null?null:typeof a=="number"?a:a.endsWith("ms")?U(a.substring(0,a.length-2)):a.endsWith("s")?U(a.substring(0,a.length-1))*1e3:a==="0"?0:null}var Y=function(a){return a[a.OPEN=0]="OPEN",a[a.CLOSING=1]="CLOSING",a[a.CLOSED=2]="CLOSED",a}(Y||{}),ot=class{constructor(o,t,e){this._ref=o,this._containerInstance=e,this._afterOpened=new m,this._beforeClosed=new m,this._state=Y.OPEN,this.disableClose=t.disableClose,this.id=o.id,o.addPanelClass("mat-mdc-dialog-panel"),e._animationStateChanged.pipe(b(i=>i.state==="opened"),I(1)).subscribe(()=>{this._afterOpened.next(),this._afterOpened.complete()}),e._animationStateChanged.pipe(b(i=>i.state==="closed"),I(1)).subscribe(()=>{clearTimeout(this._closeFallbackTimeout),this._finishDialogClose()}),o.overlayRef.detachments().subscribe(()=>{this._beforeClosed.next(this._result),this._beforeClosed.complete(),this._finishDialogClose()}),rt(this.backdropClick(),this.keydownEvents().pipe(b(i=>i.keyCode===27&&!this.disableClose&&!V(i)))).subscribe(i=>{this.disableClose||(i.preventDefault(),Ht(this,i.type==="keydown"?"keyboard":"mouse"))})}close(o){this._result=o,this._containerInstance._animationStateChanged.pipe(b(t=>t.state==="closing"),I(1)).subscribe(t=>{this._beforeClosed.next(o),this._beforeClosed.complete(),this._ref.overlayRef.detachBackdrop(),this._closeFallbackTimeout=setTimeout(()=>this._finishDialogClose(),t.totalTime+100)}),this._state=Y.CLOSING,this._containerInstance._startExitAnimation()}afterOpened(){return this._afterOpened}afterClosed(){return this._ref.closed}beforeClosed(){return this._beforeClosed}backdropClick(){return this._ref.backdropClick}keydownEvents(){return this._ref.keydownEvents}updatePosition(o){let t=this._ref.config.positionStrategy;return o&&(o.left||o.right)?o.left?t.left(o.left):t.right(o.right):t.centerHorizontally(),o&&(o.top||o.bottom)?o.top?t.top(o.top):t.bottom(o.bottom):t.centerVertically(),this._ref.updatePosition(),this}updateSize(o="",t=""){return this._ref.updateSize(o,t),this}addPanelClass(o){return this._ref.addPanelClass(o),this}removePanelClass(o){return this._ref.removePanelClass(o),this}getState(){return this._state}_finishDialogClose(){this._state=Y.CLOSED,this._ref.close(this._result,{focusOrigin:this._closeInteractionType}),this.componentInstance=null}};function Ht(a,o,t){return a._closeInteractionType=o,a.close(t)}var $t=new u("MatMdcDialogData"),qt=new u("mat-mdc-dialog-default-options"),Yt=new u("mat-mdc-dialog-scroll-strategy",{providedIn:"root",factory:()=>{let a=f(g);return()=>a.scrollStrategies.block()}});var Qt=0,Wt=(()=>{class a{get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}_getAfterAllClosed(){let t=this._parentDialog;return t?t._getAfterAllClosed():this._afterAllClosedAtThisLevel}constructor(t,e,i,n,r,s,d,y){this._overlay=t,this._defaultOptions=n,this._scrollStrategy=r,this._parentDialog=s,this._openDialogsAtThisLevel=[],this._afterAllClosedAtThisLevel=new m,this._afterOpenedAtThisLevel=new m,this.dialogConfigClass=O,this.afterAllClosed=T(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(x(void 0))),this._dialog=e.get(it),this._dialogRefConstructor=ot,this._dialogContainerType=Gt,this._dialogDataToken=$t}open(t,e){let i;e=h(h({},this._defaultOptions||new O),e),e.id=e.id||`mat-mdc-dialog-${Qt++}`,e.scrollStrategy=e.scrollStrategy||this._scrollStrategy();let n=this._dialog.open(t,nt(h({},e),{positionStrategy:this._overlay.position().global().centerHorizontally().centerVertically(),disableClose:!0,closeOnDestroy:!1,closeOnOverlayDetachments:!1,container:{type:this._dialogContainerType,providers:()=>[{provide:this.dialogConfigClass,useValue:e},{provide:_,useValue:e}]},templateContext:()=>({dialogRef:i}),providers:(r,s,d)=>(i=new this._dialogRefConstructor(r,e,d),i.updatePosition(e?.position),[{provide:this._dialogContainerType,useValue:d},{provide:this._dialogDataToken,useValue:s.data},{provide:this._dialogRefConstructor,useValue:i}])}));return i.componentRef=n.componentRef,i.componentInstance=n.componentInstance,this.openDialogs.push(i),this.afterOpened.next(i),i.afterClosed().subscribe(()=>{let r=this.openDialogs.indexOf(i);r>-1&&(this.openDialogs.splice(r,1),this.openDialogs.length||this._getAfterAllClosed().next())}),i}closeAll(){this._closeDialogs(this.openDialogs)}getDialogById(t){return this.openDialogs.find(e=>e.id===t)}ngOnDestroy(){this._closeDialogs(this._openDialogsAtThisLevel),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete()}_closeDialogs(t){let e=t.length;for(;e--;)t[e].close()}static{this.\u0275fac=function(e){return new(e||a)(c(g),c(p),c(yt,8),c(qt,8),c(Yt),c(a,12),c($),c(W,8))}}static{this.\u0275prov=w({token:a,factory:a.\u0275fac,providedIn:"root"})}}return a})();var Ge=(()=>{class a{static{this.\u0275fac=function(e){return new(e||a)}}static{this.\u0275mod=L({type:a})}static{this.\u0275inj=k({providers:[Wt],imports:[Tt,q,D,K,K]})}}return a})();export{ot as a,$t as b,Wt as c,Ge as d};
