import{d as He,e as Ve,g as he}from"./chunk-24R4R2L3.js";import{$ as R,A as w,B as Be,H as Ne,X as ue,Y as $e,Z as Ue,_ as M,a as I,aa as Ze,b as le,ba as te,c as je,ca as T,e as Z,ea as v,g as Y,h as Q,ha as ie,i as K,j as de,q as X,r as J,w as ee,y as Pe,z as ce}from"./chunk-XGOFP3XU.js";import{d as ze,e as qe,h as We,l as Ge}from"./chunk-JBN2YPSO.js";import{Cb as z,Eb as we,F as j,Fb as x,Ga as g,Ib as q,Ic as Se,J as Ee,Ja as xe,K as O,Ka as _,Oa as C,Q as P,Qb as Te,Rb as ke,Ua as re,Vb as W,Vc as U,Xb as G,Zc as Fe,a as m,aa as B,b as Ce,cc as Oe,dc as Me,ec as Re,ha as E,ia as p,ka as u,lb as l,ma as c,na as b,nb as Ie,p as h,qc as Le,ra as N,rc as $,sa as f,t as De,ta as H,w as Ae,yb as V,za as se}from"./chunk-YASPPE65.js";function ot(n,o){}var D=class{constructor(){this.role="dialog",this.panelClass="",this.hasBackdrop=!0,this.backdropClass="",this.disableClose=!1,this.width="",this.height="",this.data=null,this.ariaDescribedBy=null,this.ariaLabelledBy=null,this.ariaLabel=null,this.ariaModal=!0,this.autoFocus="first-tabbable",this.restoreFocus=!0,this.closeOnNavigation=!0,this.closeOnDestroy=!0,this.closeOnOverlayDetachments=!0}};var ge=(()=>{class n extends Ue{constructor(e,t,i,a,r,s,d,y){super(),this._elementRef=e,this._focusTrapFactory=t,this._config=a,this._interactivityChecker=r,this._ngZone=s,this._overlayRef=d,this._focusMonitor=y,this._platform=b(I),this._focusTrap=null,this._elementFocusedBeforeDialogWasOpened=null,this._closeInteractionType=null,this._ariaLabelledByQueue=[],this._changeDetectorRef=b(Se),this._injector=b(g),this._isDestroyed=!1,this.attachDomPortal=A=>{this._portalOutlet.hasAttached();let F=this._portalOutlet.attachDomPortal(A);return this._contentAttached(),F},this._document=i,this._config.ariaLabelledBy&&this._ariaLabelledByQueue.push(this._config.ariaLabelledBy)}_addAriaLabelledBy(e){this._ariaLabelledByQueue.push(e),this._changeDetectorRef.markForCheck()}_removeAriaLabelledBy(e){let t=this._ariaLabelledByQueue.indexOf(e);t>-1&&(this._ariaLabelledByQueue.splice(t,1),this._changeDetectorRef.markForCheck())}_contentAttached(){this._initializeFocusTrap(),this._handleBackdropClicks(),this._captureInitialFocus()}_captureInitialFocus(){this._trapFocus()}ngOnDestroy(){this._isDestroyed=!0,this._restoreFocus()}attachComponentPortal(e){this._portalOutlet.hasAttached();let t=this._portalOutlet.attachComponentPortal(e);return this._contentAttached(),t}attachTemplatePortal(e){this._portalOutlet.hasAttached();let t=this._portalOutlet.attachTemplatePortal(e);return this._contentAttached(),t}_recaptureFocus(){this._containsFocus()||this._trapFocus()}_forceFocus(e,t){this._interactivityChecker.isFocusable(e)||(e.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let i=()=>{e.removeEventListener("blur",i),e.removeEventListener("mousedown",i),e.removeAttribute("tabindex")};e.addEventListener("blur",i),e.addEventListener("mousedown",i)})),e.focus(t)}_focusByCssSelector(e,t){let i=this._elementRef.nativeElement.querySelector(e);i&&this._forceFocus(i,t)}_trapFocus(){this._isDestroyed||we(()=>{let e=this._elementRef.nativeElement;switch(this._config.autoFocus){case!1:case"dialog":this._containsFocus()||e.focus();break;case!0:case"first-tabbable":this._focusTrap?.focusInitialElement()||this._focusDialogContainer();break;case"first-heading":this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');break;default:this._focusByCssSelector(this._config.autoFocus);break}},{injector:this._injector})}_restoreFocus(){let e=this._config.restoreFocus,t=null;if(typeof e=="string"?t=this._document.querySelector(e):typeof e=="boolean"?t=e?this._elementFocusedBeforeDialogWasOpened:null:e&&(t=e),this._config.restoreFocus&&t&&typeof t.focus=="function"){let i=Z(),a=this._elementRef.nativeElement;(!i||i===this._document.body||i===a||a.contains(i))&&(this._focusMonitor?(this._focusMonitor.focusVia(t,this._closeInteractionType),this._closeInteractionType=null):t.focus())}this._focusTrap&&this._focusTrap.destroy()}_focusDialogContainer(){this._elementRef.nativeElement.focus&&this._elementRef.nativeElement.focus()}_containsFocus(){let e=this._elementRef.nativeElement,t=Z();return e===t||e.contains(t)}_initializeFocusTrap(){this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._document&&(this._elementFocusedBeforeDialogWasOpened=Z()))}_handleBackdropClicks(){this._overlayRef.backdropClick().subscribe(()=>{this._config.disableClose&&this._recaptureFocus()})}static{this.\u0275fac=function(t){return new(t||n)(l(C),l(J),l(U,8),l(D),l(X),l(_),l(T),l(ee))}}static{this.\u0275cmp=N({type:n,selectors:[["cdk-dialog-container"]],viewQuery:function(t,i){if(t&1&&Oe(M,7),t&2){let a;Me(a=Re())&&(i._portalOutlet=a.first)}},hostAttrs:["tabindex","-1",1,"cdk-dialog-container"],hostVars:6,hostBindings:function(t,i){t&2&&x("id",i._config.id||null)("role",i._config.role)("aria-modal",i._config.ariaModal)("aria-labelledby",i._config.ariaLabel?null:i._ariaLabelledByQueue[0])("aria-label",i._config.ariaLabel)("aria-describedby",i._config.ariaDescribedBy||null)},standalone:!0,features:[V,$],decls:1,vars:0,consts:[["cdkPortalOutlet",""]],template:function(t,i){t&1&&z(0,ot,0,0,"ng-template",0)},dependencies:[M],styles:[".cdk-dialog-container{display:block;width:100%;height:100%;min-height:inherit;max-height:inherit}"],encapsulation:2})}}return n})(),L=class{constructor(o,e){this.overlayRef=o,this.config=e,this.closed=new h,this.disableClose=e.disableClose,this.backdropClick=o.backdropClick(),this.keydownEvents=o.keydownEvents(),this.outsidePointerEvents=o.outsidePointerEvents(),this.id=e.id,this.keydownEvents.subscribe(t=>{t.keyCode===27&&!this.disableClose&&!Y(t)&&(t.preventDefault(),this.close(void 0,{focusOrigin:"keyboard"}))}),this.backdropClick.subscribe(()=>{this.disableClose||this.close(void 0,{focusOrigin:"mouse"})}),this._detachSubscription=o.detachments().subscribe(()=>{e.closeOnOverlayDetachments!==!1&&this.close()})}close(o,e){if(this.containerInstance){let t=this.closed;this.containerInstance._closeInteractionType=e?.focusOrigin||"program",this._detachSubscription.unsubscribe(),this.overlayRef.dispose(),t.next(o),t.complete(),this.componentInstance=this.containerInstance=null}}updatePosition(){return this.overlayRef.updatePosition(),this}updateSize(o="",e=""){return this.overlayRef.updateSize({width:o,height:e}),this}addPanelClass(o){return this.overlayRef.addPanelClass(o),this}removePanelClass(o){return this.overlayRef.removePanelClass(o),this}},st=new u("DialogScrollStrategy",{providedIn:"root",factory:()=>{let n=b(v);return()=>n.scrollStrategies.block()}}),rt=new u("DialogData"),lt=new u("DefaultDialogConfig");var dt=0,_e=(()=>{class n{get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}constructor(e,t,i,a,r,s){this._overlay=e,this._injector=t,this._defaultOptions=i,this._parentDialog=a,this._overlayContainer=r,this._openDialogsAtThisLevel=[],this._afterAllClosedAtThisLevel=new h,this._afterOpenedAtThisLevel=new h,this._ariaHiddenElements=new Map,this.afterAllClosed=j(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(B(void 0))),this._scrollStrategy=s}open(e,t){let i=this._defaultOptions||new D;t=m(m({},i),t),t.id=t.id||`cdk-dialog-${dt++}`,t.id&&this.getDialogById(t.id);let a=this._getOverlayConfig(t),r=this._overlay.create(a),s=new L(r,t),d=this._attachContainer(r,s,t);return s.containerInstance=d,this._attachDialogContent(e,s,d,t),this.openDialogs.length||this._hideNonDialogContentFromAssistiveTechnology(),this.openDialogs.push(s),s.closed.subscribe(()=>this._removeOpenDialog(s,!0)),this.afterOpened.next(s),s}closeAll(){me(this.openDialogs,e=>e.close())}getDialogById(e){return this.openDialogs.find(t=>t.id===e)}ngOnDestroy(){me(this._openDialogsAtThisLevel,e=>{e.config.closeOnDestroy===!1&&this._removeOpenDialog(e,!1)}),me(this._openDialogsAtThisLevel,e=>e.close()),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete(),this._openDialogsAtThisLevel=[]}_getOverlayConfig(e){let t=new Ze({positionStrategy:e.positionStrategy||this._overlay.position().global().centerHorizontally().centerVertically(),scrollStrategy:e.scrollStrategy||this._scrollStrategy(),panelClass:e.panelClass,hasBackdrop:e.hasBackdrop,direction:e.direction,minWidth:e.minWidth,minHeight:e.minHeight,maxWidth:e.maxWidth,maxHeight:e.maxHeight,width:e.width,height:e.height,disposeOnNavigation:e.closeOnNavigation});return e.backdropClass&&(t.backdropClass=e.backdropClass),t}_attachContainer(e,t,i){let a=i.injector||i.viewContainerRef?.injector,r=[{provide:D,useValue:i},{provide:L,useValue:t},{provide:T,useValue:e}],s;i.container?typeof i.container=="function"?s=i.container:(s=i.container.type,r.push(...i.container.providers(i))):s=ge;let d=new ue(s,i.viewContainerRef,g.create({parent:a||this._injector,providers:r}),i.componentFactoryResolver);return e.attach(d).instance}_attachDialogContent(e,t,i,a){if(e instanceof Ie){let r=this._createInjector(a,t,i,void 0),s={$implicit:a.data,dialogRef:t};a.templateContext&&(s=m(m({},s),typeof a.templateContext=="function"?a.templateContext():a.templateContext)),i.attachTemplatePortal(new $e(e,null,s,r))}else{let r=this._createInjector(a,t,i,this._injector),s=i.attachComponentPortal(new ue(e,a.viewContainerRef,r,a.componentFactoryResolver));t.componentRef=s,t.componentInstance=s.instance}}_createInjector(e,t,i,a){let r=e.injector||e.viewContainerRef?.injector,s=[{provide:rt,useValue:e.data},{provide:L,useValue:t}];return e.providers&&(typeof e.providers=="function"?s.push(...e.providers(t,e,i)):s.push(...e.providers)),e.direction&&(!r||!r.get(ce,null,{optional:!0}))&&s.push({provide:ce,useValue:{value:e.direction,change:Ae()}}),g.create({parent:r||a,providers:s})}_removeOpenDialog(e,t){let i=this.openDialogs.indexOf(e);i>-1&&(this.openDialogs.splice(i,1),this.openDialogs.length||(this._ariaHiddenElements.forEach((a,r)=>{a?r.setAttribute("aria-hidden",a):r.removeAttribute("aria-hidden")}),this._ariaHiddenElements.clear(),t&&this._getAfterAllClosed().next()))}_hideNonDialogContentFromAssistiveTechnology(){let e=this._overlayContainer.getContainerElement();if(e.parentElement){let t=e.parentElement.children;for(let i=t.length-1;i>-1;i--){let a=t[i];a!==e&&a.nodeName!=="SCRIPT"&&a.nodeName!=="STYLE"&&!a.hasAttribute("aria-live")&&(this._ariaHiddenElements.set(a,a.getAttribute("aria-hidden")),a.setAttribute("aria-hidden","true"))}}}_getAfterAllClosed(){let e=this._parentDialog;return e?e._getAfterAllClosed():this._afterAllClosedAtThisLevel}static{this.\u0275fac=function(t){return new(t||n)(c(v),c(g),c(lt,8),c(n,12),c(te),c(st))}}static{this.\u0275prov=E({token:n,factory:n.\u0275fac,providedIn:"root"})}}return n})();function me(n,o){let e=n.length;for(;e--;)o(n[e])}var Ye=(()=>{class n{static{this.\u0275fac=function(t){return new(t||n)}}static{this.\u0275mod=f({type:n})}static{this.\u0275inj=p({providers:[_e],imports:[ie,R,Pe,R]})}}return n})();function ct(n,o){}var S=class{constructor(){this.role="dialog",this.panelClass="",this.hasBackdrop=!0,this.backdropClass="",this.disableClose=!1,this.width="",this.height="",this.data=null,this.ariaDescribedBy=null,this.ariaLabelledBy=null,this.ariaLabel=null,this.ariaModal=!0,this.autoFocus="first-tabbable",this.restoreFocus=!0,this.delayFocusTrap=!0,this.closeOnNavigation=!0}},ve="mdc-dialog--open",Qe="mdc-dialog--opening",Ke="mdc-dialog--closing",ht=150,ut=75,mt=(()=>{class n extends ge{constructor(e,t,i,a,r,s,d,y,A){super(e,t,i,a,r,s,d,A),this._animationMode=y,this._animationStateChanged=new xe,this._animationsEnabled=this._animationMode!=="NoopAnimations",this._actionSectionCount=0,this._hostElement=this._elementRef.nativeElement,this._enterAnimationDuration=this._animationsEnabled?Je(this._config.enterAnimationDuration)??ht:0,this._exitAnimationDuration=this._animationsEnabled?Je(this._config.exitAnimationDuration)??ut:0,this._animationTimer=null,this._finishDialogOpen=()=>{this._clearAnimationClasses(),this._openAnimationDone(this._enterAnimationDuration)},this._finishDialogClose=()=>{this._clearAnimationClasses(),this._animationStateChanged.emit({state:"closed",totalTime:this._exitAnimationDuration})}}_contentAttached(){super._contentAttached(),this._startOpenAnimation()}_startOpenAnimation(){this._animationStateChanged.emit({state:"opening",totalTime:this._enterAnimationDuration}),this._animationsEnabled?(this._hostElement.style.setProperty(Xe,`${this._enterAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(Qe,ve)),this._waitForAnimationToComplete(this._enterAnimationDuration,this._finishDialogOpen)):(this._hostElement.classList.add(ve),Promise.resolve().then(()=>this._finishDialogOpen()))}_startExitAnimation(){this._animationStateChanged.emit({state:"closing",totalTime:this._exitAnimationDuration}),this._hostElement.classList.remove(ve),this._animationsEnabled?(this._hostElement.style.setProperty(Xe,`${this._exitAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(Ke)),this._waitForAnimationToComplete(this._exitAnimationDuration,this._finishDialogClose)):Promise.resolve().then(()=>this._finishDialogClose())}_updateActionSectionCount(e){this._actionSectionCount+=e,this._changeDetectorRef.markForCheck()}_clearAnimationClasses(){this._hostElement.classList.remove(Qe,Ke)}_waitForAnimationToComplete(e,t){this._animationTimer!==null&&clearTimeout(this._animationTimer),this._animationTimer=setTimeout(t,e)}_requestAnimationFrame(e){this._ngZone.runOutsideAngular(()=>{typeof requestAnimationFrame=="function"?requestAnimationFrame(e):e()})}_captureInitialFocus(){this._config.delayFocusTrap||this._trapFocus()}_openAnimationDone(e){this._config.delayFocusTrap&&this._trapFocus(),this._animationStateChanged.next({state:"opened",totalTime:e})}ngOnDestroy(){super.ngOnDestroy(),this._animationTimer!==null&&clearTimeout(this._animationTimer)}attachComponentPortal(e){let t=super.attachComponentPortal(e);return t.location.nativeElement.classList.add("mat-mdc-dialog-component-host"),t}static{this.\u0275fac=function(t){return new(t||n)(l(C),l(J),l(U,8),l(S),l(X),l(_),l(T),l(re,8),l(ee))}}static{this.\u0275cmp=N({type:n,selectors:[["mat-dialog-container"]],hostAttrs:["tabindex","-1",1,"mat-mdc-dialog-container","mdc-dialog"],hostVars:10,hostBindings:function(t,i){t&2&&(W("id",i._config.id),x("aria-modal",i._config.ariaModal)("role",i._config.role)("aria-labelledby",i._config.ariaLabel?null:i._ariaLabelledByQueue[0])("aria-label",i._config.ariaLabel)("aria-describedby",i._config.ariaDescribedBy||null),q("_mat-animation-noopable",!i._animationsEnabled)("mat-mdc-dialog-container-with-actions",i._actionSectionCount>0))},standalone:!0,features:[V,$],decls:3,vars:0,consts:[[1,"mat-mdc-dialog-inner-container","mdc-dialog__container"],[1,"mat-mdc-dialog-surface","mdc-dialog__surface"],["cdkPortalOutlet",""]],template:function(t,i){t&1&&(Te(0,"div",0)(1,"div",1),z(2,ct,0,0,"ng-template",2),ke()())},dependencies:[M],styles:['.mat-mdc-dialog-container{width:100%;height:100%;display:block;box-sizing:border-box;max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit;outline:0}.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-max-width, 80vw);min-width:var(--mat-dialog-container-min-width, 0)}@media(max-width: 599px){.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-small-max-width, 80vw)}}.mat-mdc-dialog-inner-container{display:flex;flex-direction:row;align-items:center;justify-content:space-around;box-sizing:border-box;height:100%;opacity:0;transition:opacity linear var(--mat-dialog-transition-duration, 0ms);max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit}.mdc-dialog--closing .mat-mdc-dialog-inner-container{transition:opacity 75ms linear;transform:none}.mdc-dialog--open .mat-mdc-dialog-inner-container{opacity:1}._mat-animation-noopable .mat-mdc-dialog-inner-container{transition:none}.mat-mdc-dialog-surface{display:flex;flex-direction:column;flex-grow:0;flex-shrink:0;box-sizing:border-box;width:100%;height:100%;position:relative;overflow-y:auto;outline:0;transform:scale(0.8);transition:transform var(--mat-dialog-transition-duration, 0ms) cubic-bezier(0, 0, 0.2, 1);max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit;box-shadow:var(--mat-dialog-container-elevation-shadow, 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12));border-radius:var(--mdc-dialog-container-shape, var(--mat-app-corner-extra-large, 4px));background-color:var(--mdc-dialog-container-color, var(--mat-app-surface, white))}[dir=rtl] .mat-mdc-dialog-surface{text-align:right}.mdc-dialog--open .mat-mdc-dialog-surface,.mdc-dialog--closing .mat-mdc-dialog-surface{transform:none}._mat-animation-noopable .mat-mdc-dialog-surface{transition:none}.mat-mdc-dialog-surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:2px solid rgba(0,0,0,0);border-radius:inherit;content:"";pointer-events:none}.mat-mdc-dialog-title{display:block;position:relative;flex-shrink:0;box-sizing:border-box;margin:0 0 1px;padding:var(--mat-dialog-headline-padding, 0 24px 9px)}.mat-mdc-dialog-title::before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}[dir=rtl] .mat-mdc-dialog-title{text-align:right}.mat-mdc-dialog-container .mat-mdc-dialog-title{color:var(--mdc-dialog-subhead-color, var(--mat-app-on-surface, rgba(0, 0, 0, 0.87)));font-family:var(--mdc-dialog-subhead-font, var(--mat-app-headline-small-font, inherit));line-height:var(--mdc-dialog-subhead-line-height, var(--mat-app-headline-small-line-height, 1.5rem));font-size:var(--mdc-dialog-subhead-size, var(--mat-app-headline-small-size, 1rem));font-weight:var(--mdc-dialog-subhead-weight, var(--mat-app-headline-small-weight, 400));letter-spacing:var(--mdc-dialog-subhead-tracking, var(--mat-app-headline-small-tracking, 0.03125em))}.mat-mdc-dialog-content{display:block;flex-grow:1;box-sizing:border-box;margin:0;overflow:auto;max-height:65vh}.mat-mdc-dialog-content>:first-child{margin-top:0}.mat-mdc-dialog-content>:last-child{margin-bottom:0}.mat-mdc-dialog-container .mat-mdc-dialog-content{color:var(--mdc-dialog-supporting-text-color, var(--mat-app-on-surface-variant, rgba(0, 0, 0, 0.6)));font-family:var(--mdc-dialog-supporting-text-font, var(--mat-app-body-medium-font, inherit));line-height:var(--mdc-dialog-supporting-text-line-height, var(--mat-app-body-medium-line-height, 1.5rem));font-size:var(--mdc-dialog-supporting-text-size, var(--mat-app-body-medium-size, 1rem));font-weight:var(--mdc-dialog-supporting-text-weight, var(--mat-app-body-medium-weight, 400));letter-spacing:var(--mdc-dialog-supporting-text-tracking, var(--mat-app-body-medium-tracking, 0.03125em))}.mat-mdc-dialog-container .mat-mdc-dialog-content{padding:var(--mat-dialog-content-padding, 20px 24px)}.mat-mdc-dialog-container-with-actions .mat-mdc-dialog-content{padding:var(--mat-dialog-with-actions-content-padding, 20px 24px)}.mat-mdc-dialog-container .mat-mdc-dialog-title+.mat-mdc-dialog-content{padding-top:0}.mat-mdc-dialog-actions{display:flex;position:relative;flex-shrink:0;flex-wrap:wrap;align-items:center;justify-content:flex-end;box-sizing:border-box;min-height:52px;margin:0;padding:8px;border-top:1px solid rgba(0,0,0,0);padding:var(--mat-dialog-actions-padding, 8px);justify-content:var(--mat-dialog-actions-alignment, start)}.cdk-high-contrast-active .mat-mdc-dialog-actions{border-top-color:CanvasText}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-start,.mat-mdc-dialog-actions[align=start]{justify-content:start}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-center,.mat-mdc-dialog-actions[align=center]{justify-content:center}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-end,.mat-mdc-dialog-actions[align=end]{justify-content:flex-end}.mat-mdc-dialog-actions .mat-button-base+.mat-button-base,.mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-mdc-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}.mat-mdc-dialog-component-host{display:contents}'],encapsulation:2})}}return n})(),Xe="--mat-dialog-transition-duration";function Je(n){return n==null?null:typeof n=="number"?n:n.endsWith("ms")?K(n.substring(0,n.length-2)):n.endsWith("s")?K(n.substring(0,n.length-1))*1e3:n==="0"?0:null}var ne=function(n){return n[n.OPEN=0]="OPEN",n[n.CLOSING=1]="CLOSING",n[n.CLOSED=2]="CLOSED",n}(ne||{}),ye=class{constructor(o,e,t){this._ref=o,this._containerInstance=t,this._afterOpened=new h,this._beforeClosed=new h,this._state=ne.OPEN,this.disableClose=e.disableClose,this.id=o.id,o.addPanelClass("mat-mdc-dialog-panel"),t._animationStateChanged.pipe(O(i=>i.state==="opened"),P(1)).subscribe(()=>{this._afterOpened.next(),this._afterOpened.complete()}),t._animationStateChanged.pipe(O(i=>i.state==="closed"),P(1)).subscribe(()=>{clearTimeout(this._closeFallbackTimeout),this._finishDialogClose()}),o.overlayRef.detachments().subscribe(()=>{this._beforeClosed.next(this._result),this._beforeClosed.complete(),this._finishDialogClose()}),Ee(this.backdropClick(),this.keydownEvents().pipe(O(i=>i.keyCode===27&&!this.disableClose&&!Y(i)))).subscribe(i=>{this.disableClose||(i.preventDefault(),pt(this,i.type==="keydown"?"keyboard":"mouse"))})}close(o){this._result=o,this._containerInstance._animationStateChanged.pipe(O(e=>e.state==="closing"),P(1)).subscribe(e=>{this._beforeClosed.next(o),this._beforeClosed.complete(),this._ref.overlayRef.detachBackdrop(),this._closeFallbackTimeout=setTimeout(()=>this._finishDialogClose(),e.totalTime+100)}),this._state=ne.CLOSING,this._containerInstance._startExitAnimation()}afterOpened(){return this._afterOpened}afterClosed(){return this._ref.closed}beforeClosed(){return this._beforeClosed}backdropClick(){return this._ref.backdropClick}keydownEvents(){return this._ref.keydownEvents}updatePosition(o){let e=this._ref.config.positionStrategy;return o&&(o.left||o.right)?o.left?e.left(o.left):e.right(o.right):e.centerHorizontally(),o&&(o.top||o.bottom)?o.top?e.top(o.top):e.bottom(o.bottom):e.centerVertically(),this._ref.updatePosition(),this}updateSize(o="",e=""){return this._ref.updateSize(o,e),this}addPanelClass(o){return this._ref.addPanelClass(o),this}removePanelClass(o){return this._ref.removePanelClass(o),this}getState(){return this._state}_finishDialogClose(){this._state=ne.CLOSED,this._ref.close(this._result,{focusOrigin:this._closeInteractionType}),this.componentInstance=null}};function pt(n,o,e){return n._closeInteractionType=o,n.close(e)}var ft=new u("MatMdcDialogData"),gt=new u("mat-mdc-dialog-default-options"),_t=new u("mat-mdc-dialog-scroll-strategy",{providedIn:"root",factory:()=>{let n=b(v);return()=>n.scrollStrategies.block()}});var vt=0,yt=(()=>{class n{get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}_getAfterAllClosed(){let e=this._parentDialog;return e?e._getAfterAllClosed():this._afterAllClosedAtThisLevel}constructor(e,t,i,a,r,s,d,y){this._overlay=e,this._defaultOptions=a,this._scrollStrategy=r,this._parentDialog=s,this._openDialogsAtThisLevel=[],this._afterAllClosedAtThisLevel=new h,this._afterOpenedAtThisLevel=new h,this.dialogConfigClass=S,this.afterAllClosed=j(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(B(void 0))),this._dialog=t.get(_e),this._dialogRefConstructor=ye,this._dialogContainerType=mt,this._dialogDataToken=ft}open(e,t){let i;t=m(m({},this._defaultOptions||new S),t),t.id=t.id||`mat-mdc-dialog-${vt++}`,t.scrollStrategy=t.scrollStrategy||this._scrollStrategy();let a=this._dialog.open(e,Ce(m({},t),{positionStrategy:this._overlay.position().global().centerHorizontally().centerVertically(),disableClose:!0,closeOnDestroy:!1,closeOnOverlayDetachments:!1,container:{type:this._dialogContainerType,providers:()=>[{provide:this.dialogConfigClass,useValue:t},{provide:D,useValue:t}]},templateContext:()=>({dialogRef:i}),providers:(r,s,d)=>(i=new this._dialogRefConstructor(r,t,d),i.updatePosition(t?.position),[{provide:this._dialogContainerType,useValue:d},{provide:this._dialogDataToken,useValue:s.data},{provide:this._dialogRefConstructor,useValue:i}])}));return i.componentRef=a.componentRef,i.componentInstance=a.componentInstance,this.openDialogs.push(i),this.afterOpened.next(i),i.afterClosed().subscribe(()=>{let r=this.openDialogs.indexOf(i);r>-1&&(this.openDialogs.splice(r,1),this.openDialogs.length||this._getAfterAllClosed().next())}),i}closeAll(){this._closeDialogs(this.openDialogs)}getDialogById(e){return this.openDialogs.find(t=>t.id===e)}ngOnDestroy(){this._closeDialogs(this._openDialogsAtThisLevel),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete()}_closeDialogs(e){let t=e.length;for(;t--;)e[t].close()}static{this.\u0275fac=function(t){return new(t||n)(c(v),c(g),c(Fe,8),c(gt,8),c(_t),c(n,12),c(te),c(re,8))}}static{this.\u0275prov=E({token:n,factory:n.\u0275fac,providedIn:"root"})}}return n})();var fi=(()=>{class n{static{this.\u0275fac=function(t){return new(t||n)}}static{this.\u0275mod=f({type:n})}static{this.\u0275inj=p({providers:[yt],imports:[Ye,ie,R,w,w]})}}return n})();var et=je({passive:!0}),tt=(()=>{class n{constructor(e,t){this._platform=e,this._ngZone=t,this._monitoredElements=new Map}monitor(e){if(!this._platform.isBrowser)return De;let t=de(e),i=this._monitoredElements.get(t);if(i)return i.subject;let a=new h,r="cdk-text-field-autofilled",s=d=>{d.animationName==="cdk-text-field-autofill-start"&&!t.classList.contains(r)?(t.classList.add(r),this._ngZone.run(()=>a.next({target:d.target,isAutofilled:!0}))):d.animationName==="cdk-text-field-autofill-end"&&t.classList.contains(r)&&(t.classList.remove(r),this._ngZone.run(()=>a.next({target:d.target,isAutofilled:!1})))};return this._ngZone.runOutsideAngular(()=>{t.addEventListener("animationstart",s,et),t.classList.add("cdk-text-field-autofill-monitored")}),this._monitoredElements.set(t,{subject:a,unlisten:()=>{t.removeEventListener("animationstart",s,et)}}),a}stopMonitoring(e){let t=de(e),i=this._monitoredElements.get(t);i&&(i.unlisten(),i.subject.complete(),t.classList.remove("cdk-text-field-autofill-monitored"),t.classList.remove("cdk-text-field-autofilled"),this._monitoredElements.delete(t))}ngOnDestroy(){this._monitoredElements.forEach((e,t)=>this.stopMonitoring(t))}static{this.\u0275fac=function(t){return new(t||n)(c(I),c(_))}}static{this.\u0275prov=E({token:n,factory:n.\u0275fac,providedIn:"root"})}}return n})();var it=(()=>{class n{static{this.\u0275fac=function(t){return new(t||n)}}static{this.\u0275mod=f({type:n})}static{this.\u0275inj=p({})}}return n})();var Dt=new u("MAT_INPUT_VALUE_ACCESSOR"),At=["button","checkbox","file","hidden","image","radio","range","reset","submit"],Et=0,Ni=(()=>{class n{get disabled(){return this._disabled}set disabled(e){this._disabled=Q(e),this.focused&&(this.focused=!1,this.stateChanges.next())}get id(){return this._id}set id(e){this._id=e||this._uid}get required(){return this._required??this.ngControl?.control?.hasValidator(ze.required)??!1}set required(e){this._required=Q(e)}get type(){return this._type}set type(e){this._type=e||"text",this._validateType(),!this._isTextarea&&le().has(this._type)&&(this._elementRef.nativeElement.type=this._type),this._ensureWheelDefaultBehavior()}get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e}get value(){return this._inputValueAccessor.value}set value(e){e!==this.value&&(this._inputValueAccessor.value=e,this.stateChanges.next())}get readonly(){return this._readonly}set readonly(e){this._readonly=Q(e)}get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e}constructor(e,t,i,a,r,s,d,y,A,F){this._elementRef=e,this._platform=t,this.ngControl=i,this._autofillMonitor=y,this._ngZone=A,this._formField=F,this._uid=`mat-input-${Et++}`,this._webkitBlinkWheelListenerAttached=!1,this.focused=!1,this.stateChanges=new h,this.controlType="mat-input",this.autofilled=!1,this._disabled=!1,this._type="text",this._readonly=!1,this._neverEmptyInputTypes=["date","datetime","datetime-local","month","time","week"].filter(oe=>le().has(oe)),this._iOSKeyupListener=oe=>{let k=oe.target;!k.value&&k.selectionStart===0&&k.selectionEnd===0&&(k.setSelectionRange(1,1),k.setSelectionRange(0,0))},this._webkitBlinkWheelListener=()=>{};let ae=this._elementRef.nativeElement,be=ae.nodeName.toLowerCase();this._inputValueAccessor=d||ae,this._previousNativeValue=this.value,this.id=this.id,t.IOS&&A.runOutsideAngular(()=>{e.nativeElement.addEventListener("keyup",this._iOSKeyupListener)}),this._errorStateTracker=new Be(s,i,r,a,this.stateChanges),this._isServer=!this._platform.isBrowser,this._isNativeSelect=be==="select",this._isTextarea=be==="textarea",this._isInFormField=!!F,this._isNativeSelect&&(this.controlType=ae.multiple?"mat-native-select-multiple":"mat-native-select")}ngAfterViewInit(){this._platform.isBrowser&&this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(e=>{this.autofilled=e.isAutofilled,this.stateChanges.next()})}ngOnChanges(){this.stateChanges.next()}ngOnDestroy(){this.stateChanges.complete(),this._platform.isBrowser&&this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement),this._platform.IOS&&this._elementRef.nativeElement.removeEventListener("keyup",this._iOSKeyupListener),this._webkitBlinkWheelListenerAttached&&this._elementRef.nativeElement.removeEventListener("wheel",this._webkitBlinkWheelListener)}ngDoCheck(){this.ngControl&&(this.updateErrorState(),this.ngControl.disabled!==null&&this.ngControl.disabled!==this.disabled&&(this.disabled=this.ngControl.disabled,this.stateChanges.next())),this._dirtyCheckNativeValue(),this._dirtyCheckPlaceholder()}focus(e){this._elementRef.nativeElement.focus(e)}updateErrorState(){this._errorStateTracker.updateErrorState()}_focusChanged(e){e!==this.focused&&(this.focused=e,this.stateChanges.next())}_onInput(){}_dirtyCheckNativeValue(){let e=this._elementRef.nativeElement.value;this._previousNativeValue!==e&&(this._previousNativeValue=e,this.stateChanges.next())}_dirtyCheckPlaceholder(){let e=this._getPlaceholder();if(e!==this._previousPlaceholder){let t=this._elementRef.nativeElement;this._previousPlaceholder=e,e?t.setAttribute("placeholder",e):t.removeAttribute("placeholder")}}_getPlaceholder(){return this.placeholder||null}_validateType(){At.indexOf(this._type)>-1}_isNeverEmpty(){return this._neverEmptyInputTypes.indexOf(this._type)>-1}_isBadInput(){let e=this._elementRef.nativeElement.validity;return e&&e.badInput}get empty(){return!this._isNeverEmpty()&&!this._elementRef.nativeElement.value&&!this._isBadInput()&&!this.autofilled}get shouldLabelFloat(){if(this._isNativeSelect){let e=this._elementRef.nativeElement,t=e.options[0];return this.focused||e.multiple||!this.empty||!!(e.selectedIndex>-1&&t&&t.label)}else return this.focused||!this.empty}setDescribedByIds(e){e.length?this._elementRef.nativeElement.setAttribute("aria-describedby",e.join(" ")):this._elementRef.nativeElement.removeAttribute("aria-describedby")}onContainerClick(){this.focused||this.focus()}_isInlineSelect(){let e=this._elementRef.nativeElement;return this._isNativeSelect&&(e.multiple||e.size>1)}_ensureWheelDefaultBehavior(){!this._webkitBlinkWheelListenerAttached&&this._type==="number"&&(this._platform.BLINK||this._platform.WEBKIT)&&(this._ngZone.runOutsideAngular(()=>{this._elementRef.nativeElement.addEventListener("wheel",this._webkitBlinkWheelListener)}),this._webkitBlinkWheelListenerAttached=!0),this._webkitBlinkWheelListenerAttached&&this._type!=="number"&&(this._elementRef.nativeElement.removeEventListener("wheel",this._webkitBlinkWheelListener),this._webkitBlinkWheelListenerAttached=!0)}static{this.\u0275fac=function(t){return new(t||n)(l(C),l(I),l(qe,10),l(We,8),l(Ge,8),l(Ne),l(Dt,10),l(tt),l(_),l(Ve,8))}}static{this.\u0275dir=H({type:n,selectors:[["input","matInput",""],["textarea","matInput",""],["select","matNativeControl",""],["input","matNativeControl",""],["textarea","matNativeControl",""]],hostAttrs:[1,"mat-mdc-input-element"],hostVars:18,hostBindings:function(t,i){t&1&&G("focus",function(){return i._focusChanged(!0)})("blur",function(){return i._focusChanged(!1)})("input",function(){return i._onInput()}),t&2&&(W("id",i.id)("disabled",i.disabled)("required",i.required),x("name",i.name||null)("readonly",i.readonly&&!i._isNativeSelect||null)("aria-invalid",i.empty&&i.required?null:i.errorState)("aria-required",i.required)("id",i.id),q("mat-input-server",i._isServer)("mat-mdc-form-field-textarea-control",i._isInFormField&&i._isTextarea)("mat-mdc-form-field-input-control",i._isInFormField)("mdc-text-field__input",i._isInFormField)("mat-mdc-native-select-inline",i._isInlineSelect()))},inputs:{disabled:"disabled",id:"id",placeholder:"placeholder",name:"name",required:"required",type:"type",errorStateMatcher:"errorStateMatcher",userAriaDescribedBy:[0,"aria-describedby","userAriaDescribedBy"],value:"value",readonly:"readonly"},exportAs:["matInput"],standalone:!0,features:[Le([{provide:He,useExisting:n}]),se]})}}return n})(),Hi=(()=>{class n{static{this.\u0275fac=function(t){return new(t||n)}}static{this.\u0275mod=f({type:n})}static{this.\u0275inj=p({imports:[w,he,he,it,w]})}}return n})();export{Dt as a,Ni as b,Hi as c,ye as d,ft as e,yt as f,fi as g};
