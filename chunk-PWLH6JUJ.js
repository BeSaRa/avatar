import{a as Xe,b as et}from"./chunk-JDG2F7WU.js";import{a as Ke,b as Je}from"./chunk-HNHA7TW5.js";import"./chunk-Z6O5A4ZJ.js";import{b as je,c as Ve}from"./chunk-XRKHEIXH.js";import"./chunk-WG6YCDDM.js";import{f as Be}from"./chunk-24R4R2L3.js";import{a as qe}from"./chunk-6VHVS5FK.js";import{A as Re,N as $e,ja as Ye,ka as Ze}from"./chunk-XGOFP3XU.js";import"./chunk-EJJBCPAK.js";import{b as He}from"./chunk-N6XUB5HD.js";import{b as Ne,f as Ue,i as Qe,k as Ge,r as We}from"./chunk-JBN2YPSO.js";import{b as Le,f as De,g as Q}from"./chunk-UKFJJPEC.js";import{$c as Ae,A as le,Aa as h,B as pe,Ba as f,Ca as v,Cb as m,Da as K,Ea as be,Fb as P,Gb as l,Ic as ke,Ja as xe,K as Y,Kb as Pe,Lb as d,Lc as U,Mc as R,Nb as B,O as me,Ob as F,Oc as Me,Pb as L,Pc as Oe,Qb as o,Rb as s,Sb as _,T as de,Tb as I,Ub as y,V as ge,Xb as u,Zb as p,a as oe,ad as ie,b as se,ba as _e,bd as Ee,ca as ue,ea as Z,ed as Fe,fb as Se,gc as Te,ha as w,hc as we,ia as j,ic as x,jc as g,ka as he,kb as r,kc as z,lb as A,lc as S,na as b,oa as fe,p as T,pa as ve,pc as Ie,q,qc as ze,r as ce,ra as O,rc as D,sa as V,tc as X,uc as N,vb as E,wb as Ce,wc as ee,xc as te,yb as ye,zb as J,zc as k}from"./chunk-YASPPE65.js";var $={facet:"",page_number:1,page_size:10,query:"\u0632\u0648\u0627\u062C",sort:"date"};var G=class t{http=b(Le);urlService=b(De);search(i){let e=`${this.urlService.URLS.AI_SEARCH}/website`;return this.http.post(e,i)}static \u0275fac=function(e){return new(e||t)};static \u0275prov=w({token:t,factory:t.\u0275fac,providedIn:"root"})};var H=class t{lang=b(Q);changes=new T;itemsPerPageLabel=this.lang.locals.items_per_page_label;nextPageLabel=this.lang.locals.next_page_label;previousPageLabel=this.lang.locals.previous_page_label;firstPageLabel=this.lang.locals.first_page_label;lastPageLabel=this.lang.locals.last_page_label;getRangeLabel(i,e,n){if(n===0)return`${this.lang.locals.page} 1 ${this.lang.locals.of} 1`;let a=Math.ceil(n/e);return`${this.lang.locals.page} ${i+1} ${this.lang.locals.of} ${a}`}static \u0275fac=function(e){return new(e||t)};static \u0275prov=w({token:t,factory:t.\u0275fac,providedIn:"root"})};function rt(t,i){if(t&1&&(o(0,"mat-option",17),g(1),s()),t&2){let e=i.$implicit;l("value",e),r(),S(" ",e," ")}}function ot(t,i){if(t&1){let e=y();o(0,"mat-form-field",14)(1,"mat-select",16,0),u("selectionChange",function(a){h(e);let c=p(2);return f(c._changePageSize(a.value))}),F(3,rt,2,2,"mat-option",17,B),s(),o(5,"div",18),u("click",function(){h(e);let a=x(2);return f(a.open())}),s()()}if(t&2){let e=p(2);l("appearance",e._formFieldAppearance)("color",e.color),r(),l("value",e.pageSize)("disabled",e.disabled)("aria-labelledby",e._pageSizeLabelId)("panelClass",e.selectConfig.panelClass||"")("disableOptionCentering",e.selectConfig.disableOptionCentering),r(2),L(e._displayedPageSizeOptions)}}function st(t,i){if(t&1&&(o(0,"div",15),g(1),s()),t&2){let e=p(2);r(),z(e.pageSize)}}function ct(t,i){if(t&1&&(o(0,"div",3)(1,"div",13),g(2),s(),m(3,ot,6,7,"mat-form-field",14)(4,st,2,1,"div",15),s()),t&2){let e=p();r(),P("id",e._pageSizeLabelId),r(),S(" ",e._intl.itemsPerPageLabel," "),r(),d(e._displayedPageSizeOptions.length>1?3:-1),r(),d(e._displayedPageSizeOptions.length<=1?4:-1)}}function lt(t,i){if(t&1){let e=y();o(0,"button",19),u("click",function(){h(e);let a=p();return f(a.firstPage())}),v(),o(1,"svg",8),_(2,"path",20),s()()}if(t&2){let e=p();l("matTooltip",e._intl.firstPageLabel)("matTooltipDisabled",e._previousButtonsDisabled())("matTooltipPosition","above")("disabled",e._previousButtonsDisabled()),P("aria-label",e._intl.firstPageLabel)}}function pt(t,i){if(t&1){let e=y();o(0,"button",21),u("click",function(){h(e);let a=p();return f(a.lastPage())}),v(),o(1,"svg",8),_(2,"path",22),s()()}if(t&2){let e=p();l("matTooltip",e._intl.lastPageLabel)("matTooltipDisabled",e._nextButtonsDisabled())("matTooltipPosition","above")("disabled",e._nextButtonsDisabled()),P("aria-label",e._intl.lastPageLabel)}}var M=(()=>{class t{constructor(){this.changes=new T,this.itemsPerPageLabel="Items per page:",this.nextPageLabel="Next page",this.previousPageLabel="Previous page",this.firstPageLabel="First page",this.lastPageLabel="Last page",this.getRangeLabel=(e,n,a)=>{if(a==0||n==0)return`0 of ${a}`;a=Math.max(a,0);let c=e*n,C=c<a?Math.min(c+n,a):c+n;return`${c+1} \u2013 ${C} of ${a}`}}static{this.\u0275fac=function(n){return new(n||t)}}static{this.\u0275prov=w({token:t,factory:t.\u0275fac,providedIn:"root"})}}return t})();function mt(t){return t||new M}var dt={provide:M,deps:[[new fe,new ve,M]],useFactory:mt},gt=50;var _t=new he("MAT_PAGINATOR_DEFAULT_OPTIONS"),ut=0,ae=(()=>{class t{get pageIndex(){return this._pageIndex}set pageIndex(e){this._pageIndex=Math.max(e||0,0),this._changeDetectorRef.markForCheck()}get length(){return this._length}set length(e){this._length=e||0,this._changeDetectorRef.markForCheck()}get pageSize(){return this._pageSize}set pageSize(e){this._pageSize=Math.max(e||0,0),this._updateDisplayedPageSizeOptions()}get pageSizeOptions(){return this._pageSizeOptions}set pageSizeOptions(e){this._pageSizeOptions=(e||[]).map(n=>R(n,0)),this._updateDisplayedPageSizeOptions()}constructor(e,n,a){if(this._intl=e,this._changeDetectorRef=n,this._pageSizeLabelId=`mat-paginator-page-size-label-${ut++}`,this._isInitialized=!1,this._initializedStream=new ce(1),this._pageIndex=0,this._length=0,this._pageSizeOptions=[],this.hidePageSize=!1,this.showFirstLastButtons=!1,this.selectConfig={},this.disabled=!1,this.page=new xe,this.initialized=this._initializedStream,this._intlChanges=e.changes.subscribe(()=>this._changeDetectorRef.markForCheck()),a){let{pageSize:c,pageSizeOptions:C,hidePageSize:ne,showFirstLastButtons:re}=a;c!=null&&(this._pageSize=c),C!=null&&(this._pageSizeOptions=C),ne!=null&&(this.hidePageSize=ne),re!=null&&(this.showFirstLastButtons=re)}this._formFieldAppearance=a?.formFieldAppearance||"outline"}ngOnInit(){this._isInitialized=!0,this._updateDisplayedPageSizeOptions(),this._initializedStream.next()}ngOnDestroy(){this._initializedStream.complete(),this._intlChanges.unsubscribe()}nextPage(){if(!this.hasNextPage())return;let e=this.pageIndex;this.pageIndex=this.pageIndex+1,this._emitPageEvent(e)}previousPage(){if(!this.hasPreviousPage())return;let e=this.pageIndex;this.pageIndex=this.pageIndex-1,this._emitPageEvent(e)}firstPage(){if(!this.hasPreviousPage())return;let e=this.pageIndex;this.pageIndex=0,this._emitPageEvent(e)}lastPage(){if(!this.hasNextPage())return;let e=this.pageIndex;this.pageIndex=this.getNumberOfPages()-1,this._emitPageEvent(e)}hasPreviousPage(){return this.pageIndex>=1&&this.pageSize!=0}hasNextPage(){let e=this.getNumberOfPages()-1;return this.pageIndex<e&&this.pageSize!=0}getNumberOfPages(){return this.pageSize?Math.ceil(this.length/this.pageSize):0}_changePageSize(e){let n=this.pageIndex*this.pageSize,a=this.pageIndex;this.pageIndex=Math.floor(n/e)||0,this.pageSize=e,this._emitPageEvent(a)}_nextButtonsDisabled(){return this.disabled||!this.hasNextPage()}_previousButtonsDisabled(){return this.disabled||!this.hasPreviousPage()}_updateDisplayedPageSizeOptions(){this._isInitialized&&(this.pageSize||(this._pageSize=this.pageSizeOptions.length!=0?this.pageSizeOptions[0]:gt),this._displayedPageSizeOptions=this.pageSizeOptions.slice(),this._displayedPageSizeOptions.indexOf(this.pageSize)===-1&&this._displayedPageSizeOptions.push(this.pageSize),this._displayedPageSizeOptions.sort((e,n)=>e-n),this._changeDetectorRef.markForCheck())}_emitPageEvent(e){this.page.emit({previousPageIndex:e,pageIndex:this.pageIndex,pageSize:this.pageSize,length:this.length})}static{this.\u0275fac=function(n){return new(n||t)(A(M),A(ke),A(_t,8))}}static{this.\u0275cmp=O({type:t,selectors:[["mat-paginator"]],hostAttrs:["role","group",1,"mat-mdc-paginator"],inputs:{color:"color",pageIndex:[2,"pageIndex","pageIndex",R],length:[2,"length","length",R],pageSize:[2,"pageSize","pageSize",R],pageSizeOptions:"pageSizeOptions",hidePageSize:[2,"hidePageSize","hidePageSize",U],showFirstLastButtons:[2,"showFirstLastButtons","showFirstLastButtons",U],selectConfig:"selectConfig",disabled:[2,"disabled","disabled",U]},outputs:{page:"page"},exportAs:["matPaginator"],standalone:!0,features:[J,D],decls:14,vars:14,consts:[["selectRef",""],[1,"mat-mdc-paginator-outer-container"],[1,"mat-mdc-paginator-container"],[1,"mat-mdc-paginator-page-size"],[1,"mat-mdc-paginator-range-actions"],["aria-live","polite",1,"mat-mdc-paginator-range-label"],["mat-icon-button","","type","button",1,"mat-mdc-paginator-navigation-first",3,"matTooltip","matTooltipDisabled","matTooltipPosition","disabled"],["mat-icon-button","","type","button",1,"mat-mdc-paginator-navigation-previous",3,"click","matTooltip","matTooltipDisabled","matTooltipPosition","disabled"],["viewBox","0 0 24 24","focusable","false","aria-hidden","true",1,"mat-mdc-paginator-icon"],["d","M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"],["mat-icon-button","","type","button",1,"mat-mdc-paginator-navigation-next",3,"click","matTooltip","matTooltipDisabled","matTooltipPosition","disabled"],["d","M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"],["mat-icon-button","","type","button",1,"mat-mdc-paginator-navigation-last",3,"matTooltip","matTooltipDisabled","matTooltipPosition","disabled"],[1,"mat-mdc-paginator-page-size-label"],[1,"mat-mdc-paginator-page-size-select",3,"appearance","color"],[1,"mat-mdc-paginator-page-size-value"],["hideSingleSelectionIndicator","",3,"selectionChange","value","disabled","aria-labelledby","panelClass","disableOptionCentering"],[3,"value"],[1,"mat-mdc-paginator-touch-target",3,"click"],["mat-icon-button","","type","button",1,"mat-mdc-paginator-navigation-first",3,"click","matTooltip","matTooltipDisabled","matTooltipPosition","disabled"],["d","M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"],["mat-icon-button","","type","button",1,"mat-mdc-paginator-navigation-last",3,"click","matTooltip","matTooltipDisabled","matTooltipPosition","disabled"],["d","M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"]],template:function(n,a){n&1&&(o(0,"div",1)(1,"div",2),m(2,ct,5,4,"div",3),o(3,"div",4)(4,"div",5),g(5),s(),m(6,lt,3,5,"button",6),o(7,"button",7),u("click",function(){return a.previousPage()}),v(),o(8,"svg",8),_(9,"path",9),s()(),K(),o(10,"button",10),u("click",function(){return a.nextPage()}),v(),o(11,"svg",8),_(12,"path",11),s()(),m(13,pt,3,5,"button",12),s()()()),n&2&&(r(2),d(a.hidePageSize?-1:2),r(3),S(" ",a._intl.getRangeLabel(a.pageIndex,a.pageSize,a.length)," "),r(),d(a.showFirstLastButtons?6:-1),r(),l("matTooltip",a._intl.previousPageLabel)("matTooltipDisabled",a._previousButtonsDisabled())("matTooltipPosition","above")("disabled",a._previousButtonsDisabled()),P("aria-label",a._intl.previousPageLabel),r(3),l("matTooltip",a._intl.nextPageLabel)("matTooltipDisabled",a._nextButtonsDisabled())("matTooltipPosition","above")("disabled",a._nextButtonsDisabled()),P("aria-label",a._intl.nextPageLabel),r(3),d(a.showFirstLastButtons?13:-1))},dependencies:[Be,Xe,$e,je,Ye],styles:[".mat-mdc-paginator{display:block;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;color:var(--mat-paginator-container-text-color, var(--mat-app-on-surface));background-color:var(--mat-paginator-container-background-color, var(--mat-app-surface));font-family:var(--mat-paginator-container-text-font, var(--mat-app-body-small-font));line-height:var(--mat-paginator-container-text-line-height, var(--mat-app-body-small-line-height));font-size:var(--mat-paginator-container-text-size, var(--mat-app-body-small-size));font-weight:var(--mat-paginator-container-text-weight, var(--mat-app-body-small-weight));letter-spacing:var(--mat-paginator-container-text-tracking, var(--mat-app-body-small-tracking));--mat-form-field-container-height:var(--mat-paginator-form-field-container-height);--mat-form-field-container-vertical-padding:var(--mat-paginator-form-field-container-vertical-padding)}.mat-mdc-paginator .mat-mdc-select-value{font-size:var(--mat-paginator-select-trigger-text-size, var(--mat-app-body-small-size))}.mat-mdc-paginator .mat-mdc-form-field-subscript-wrapper{display:none}.mat-mdc-paginator .mat-mdc-select{line-height:1.5}.mat-mdc-paginator-outer-container{display:flex}.mat-mdc-paginator-container{display:flex;align-items:center;justify-content:flex-end;padding:0 8px;flex-wrap:wrap;width:100%;min-height:var(--mat-paginator-container-size)}.mat-mdc-paginator-page-size{display:flex;align-items:baseline;margin-right:8px}[dir=rtl] .mat-mdc-paginator-page-size{margin-right:0;margin-left:8px}.mat-mdc-paginator-page-size-label{margin:0 4px}.mat-mdc-paginator-page-size-select{margin:0 4px;width:84px}.mat-mdc-paginator-range-label{margin:0 32px 0 24px}.mat-mdc-paginator-range-actions{display:flex;align-items:center}.mat-mdc-paginator-icon{display:inline-block;width:28px;fill:var(--mat-paginator-enabled-icon-color, var(--mat-app-on-surface-variant))}.mat-mdc-icon-button[disabled] .mat-mdc-paginator-icon{fill:var(--mat-paginator-disabled-icon-color)}[dir=rtl] .mat-mdc-paginator-icon{transform:rotate(180deg)}.cdk-high-contrast-active .mat-mdc-icon-button[disabled] .mat-mdc-paginator-icon,.cdk-high-contrast-active .mat-mdc-paginator-icon{fill:currentColor;fill:CanvasText}.cdk-high-contrast-active .mat-mdc-paginator-range-actions .mat-mdc-icon-button{outline:solid 1px}.mat-mdc-paginator-touch-target{display:var(--mat-paginator-touch-target-display);position:absolute;top:50%;left:50%;width:84px;height:48px;background-color:rgba(0,0,0,0);transform:translate(-50%, -50%);cursor:pointer}"],encapsulation:2,changeDetection:0})}}return t})(),tt=(()=>{class t{static{this.\u0275fac=function(n){return new(n||t)}}static{this.\u0275mod=V({type:t})}static{this.\u0275inj=j({providers:[dt],imports:[Ve,et,Ze,ae]})}}return t})();var it=(()=>{class t{static{this.\u0275fac=function(n){return new(n||t)}}static{this.\u0275mod=V({type:t})}static{this.\u0275inj=j({imports:[Fe,Re]})}}return t})();var ft=["paginator"],vt=(t,i)=>i.chunk_id,bt=(t,i)=>({$implicit:t,value:i,klass:"truncate max-w-[50%]"}),xt=(t,i)=>({$implicit:t,value:i}),St=(t,i)=>({"!truncate":t,"!whitespace-nowrap":i}),at=t=>({$implicit:t});function Ct(t,i){if(t&1&&I(0,10),t&2){p();let e=x(16);l("ngTemplateOutlet",e)}}function yt(t,i){t&1&&I(0)}function Pt(t,i){if(t&1&&m(0,yt,1,0,"ng-container",19),t&2){let e=p(2),n=x(18);l("ngTemplateOutlet",n)("ngTemplateOutletContext",N(2,bt,e.lang.locals.search_about,e.searchToken()))}}function Tt(t,i){t&1&&I(0)}function wt(t,i){if(t&1&&m(0,Tt,1,0,"ng-container",19),t&2){let e=p(2),n=x(18);l("ngTemplateOutlet",n)("ngTemplateOutletContext",N(2,xt,e.lang.locals.result_count,e.total()))}}function It(t,i){}function zt(t,i){t&1&&m(0,It,0,0,"ng-template")}function kt(t,i){}function Mt(t,i){t&1&&m(0,kt,0,0,"ng-template")}function Ot(t,i){if(t&1&&m(0,zt,1,0,null,19)(1,Mt,1,0,null,19),t&2){let e=p().$implicit;p(2);let n=x(20);l("ngTemplateOutlet",n)("ngTemplateOutletContext",X(4,at,e["@search.highlights"].merged_content)),r(),l("ngTemplateOutlet",n)("ngTemplateOutletContext",X(6,at,e["@search.highlights"].imageCaption))}}function At(t,i){t&1&&(v(),o(0,"svg",23),_(1,"path",24),s())}function Et(t,i){t&1&&(v(),o(0,"svg",23),_(1,"path",25),s())}function Ft(t,i){if(t&1){let e=y();Ie(0),o(1,"div",17)(2,"dt")(3,"a",20),g(4),s(),m(5,Ot,2,8),s(),o(6,"dd",21),g(7),s(),o(8,"button",22),u("click",function(){let a=h(e).$index,c=p(2);return f(c.isTruncatedContent()[a]=!c.isTruncatedContent()[a])}),g(9),m(10,At,2,0,":svg:svg",23)(11,Et,2,0,":svg:svg",23),s()()}if(t&2){let e=i.$implicit,n=i.$index,a=p(2),c=a.isTruncatedContent()[n];r(3),l("href",e.ref_url,Se),r(),S(" ",e.title," "),r(),d(e["@search.highlights"]?5:-1),r(),l("ngClass",N(7,St,c,c)),r(),S(" ",e.chunk," "),r(2),S(" ",c?a.lang.locals.show_more:a.lang.locals.show_less," "),r(),d(c?10:11)}}function Lt(t,i){if(t&1){let e=y();o(0,"div",13)(1,"div",14),m(2,Pt,1,5,"ng-container")(3,wt,1,5,"ng-container"),s(),o(4,"div",15)(5,"dl",16),F(6,Ft,12,10,"div",17,vt),s()(),o(8,"mat-paginator",18,5),u("page",function(a){h(e);let c=p();return f(c.onPaginate(a))}),s()()}if(t&2){let e=p();r(2),d(e.searchToken()?2:-1),r(),d(e.total()?3:-1),r(2),l("@fadeInSlideUp",e.animateTrigger()),r(),L(i),r(2),l("pageSizeOptions",e.pageSizeOptions)("pageSize",e.pageSize)("length",e.total())}}function Dt(t,i){t&1&&(o(0,"div",26),v(),o(1,"svg",27),_(2,"path",28),s()())}function Rt(t,i){t&1&&(o(0,"div",29)(1,"div",30)(2,"span",31),g(3,"Loading..."),s()()())}function $t(t,i){if(t&1&&(o(0,"span"),g(1),o(2,"strong"),g(3),s()()),t&2){let e=i.$implicit,n=i.value,a=i.klass;Pe("bg-primary  ",a," text-gray-200 rounded-md text-base px-2.5 py-0.5 border border-primary shadow-gray-200 shadow-sm"),r(),S("",e," : "),r(2),z(n)}}function jt(t,i){if(t&1&&(o(0,"p"),g(1),s()),t&2){let e=i.$implicit;r(),z(e)}}function Vt(t,i){if(t&1&&(o(0,"div"),F(1,jt,2,1,"p",null,B),s()),t&2){let e=p().$implicit;r(),L(e)}}function Bt(t,i){if(t&1&&m(0,Vt,3,0,"div"),t&2){let e=i.$implicit;d(e.length>0?0:-1)}}var nt=class t extends qe(class{}){paginator=Ce("paginator");aiSearchService=b(G);store=b(He);lang=b(Q);searchForm=new Qe("",{nonNullable:!0});loadingSubject$=new T;search$=new q("");paginate$=new q({page_number:$.page_number,page_size:$.page_size});total=E(0);searchToken=E("");searchResults$=this.load();isTruncatedContent=E([]);pageSizeOptions=[5,10,20,30,40,50,100];pageSize=$.page_size;animateTrigger=E(!1);storeEffect=Oe(()=>{this.store.isRecordingStopped()&&Me(()=>{this.prepareForSearch(this.searchForm.value)})});ngOnInit(){this.listenToSearch()}load(){return pe([this.search$,this.paginate$]).pipe(Y(([i])=>i.trim().length>0),Z(([i])=>this.searchToken.set(i)),_e(([i,e])=>{let n=se(oe({},$),{page_number:e.page_number,page_size:e.page_size,query:i});return this.loadingSubject$.next(!0),this.aiSearchService.search(n).pipe(ge(()=>this.loadingSubject$.next(!1)))}),Z(({total_count:i,rs:e})=>{this.total.set(i),this.isTruncatedContent.set(Array.from({length:e?.length??0},()=>!0)),this.animateTrigger.set(!this.animateTrigger())}),le(i=>i.rs))}onPaginate(i){this.paginate$.next({page_number:i.pageIndex+1,page_size:i.pageSize})}listenToSearch(){this.searchForm.valueChanges.pipe(ue(this.destroy$),de(),me(400),Y(i=>i.trim().length>0&&this.store.isRecordingStopped())).subscribe(i=>{this.prepareForSearch(i,!1)})}resetPaginator(){this.paginator()&&(this.paginator().pageIndex=0,this.paginator()._changePageSize(this.paginator().pageSize))}prepareForSearch(i,e=!0){this.resetPaginator(),this.search$.next(i),e&&this.searchForm.reset("",{emitEvent:!1})}static \u0275fac=(()=>{let i;return function(n){return(i||(i=be(t)))(n||t)}})();static \u0275cmp=O({type:t,selectors:[["app-ai-search"]],viewQuery:function(e,n){e&1&&Te(n.paginator,ft,5),e&2&&we()},standalone:!0,features:[ze([{provide:M,useClass:H}]),ye,D],decls:21,vars:10,consts:[["recorder",""],["searchIcon",""],["spinnerIcon",""],["badge",""],["highlightOptions",""],["paginator",""],[1,"flex","flex-col","justify-center","items-center","gap-4"],[1,"text-gray-200","text-lg"],[1,"flex","justify-center","items-center","gap-4","w-full"],[1,"relative","flex","gap-2","w-6/12"],[3,"ngTemplateOutlet"],["type","text","tabindex","1",1,"block","w-full","p-3","ps-10","pe-12","text-lg","text-gray-700","border","border-gray-300","rounded-lg","bg-gray-100","focus:ring-gray-400","focus:border-gray-400","focus:ring-4","outline-none","ring-2","ring-gray-500",3,"formControl","placeholder"],[3,"recognized$","recognizing$"],[1,"container","m-2"],[1,"flex","justify-start","items-center","gap-2","mb-2"],[1,"flex","justify-center","items-center"],[1,"bg-gray-200","shadow-gray-200","overflow-hidden","relative","shadow-sm","w-full","rounded-md","border-gray-400","border","p-4","text-gray-700"],[1,"flex","flex-col","border-b","last-of-type:border-none","border-gray-400","p-2","space-y-3"],[1,"rounded-md","sticky","bottom-0","border-2","border-gray-700","mt-3","[&_div.mat-mdc-paginator-outer-container]:bg-gray-200","[&_div.mat-mdc-paginator-outer-container]:rounded-md","[&_div.mat-mdc-paginator-outer-container_div.mat-mdc-paginator-container]:justify-center",3,"page","pageSizeOptions","pageSize","length"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["target","_blank",1,"font-semibold","text-primary","underline","cursor-pointer",3,"href"],[3,"ngClass"],["type","button",1,"text-blue-600","outline-none","text-base","bg-transparent","underline","flex","justify-start","items-center","gap-1",3,"click"],["xmlns","http://www.w3.org/2000/svg","fill","currentColor","viewBox","0 0 24 24",1,"size-6"],["d","M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"],["d","M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"],[1,"absolute","inset-y-0","start-0","flex","items-center","ps-3","pointer-events-none"],["aria-hidden","true","xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 20 20",1,"w-4","h-4","text-gray-500"],["stroke","currentColor","stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"],[1,"absolute","inset-y-0","end-0","flex","items-center","pe-3","pointer-events-none"],["role","status","aria-label","loading",1,"animate-spin","inline-block","size-6","border-[3px]","border-current","border-t-transparent","text-primary","rounded-full"],[1,"sr-only"]],template:function(e,n){if(e&1){let a=y();o(0,"div",6)(1,"h5",7),g(2),s(),o(3,"div",8)(4,"div",9),I(5,10),_(6,"input",11),m(7,Ct,1,1,"ng-container",10),ee(8,"async"),s(),o(9,"app-recorder",12,0),u("recognized$",function(C){return h(a),f(n.searchForm.setValue(C))})("recognizing$",function(C){return h(a),f(n.searchForm.setValue(C))}),s()()(),m(11,Lt,10,6,"div",13),ee(12,"async"),m(13,Dt,3,0,"ng-template",null,1,k)(15,Rt,4,0,"ng-template",null,2,k)(17,$t,4,5,"ng-template",null,3,k)(19,Bt,1,1,"ng-template",null,4,k)}if(e&2){let a,c=x(14);r(2),z(n.lang.locals.search_message),r(3),l("ngTemplateOutlet",c),r(),l("formControl",n.searchForm)("placeholder",n.lang.locals.search_in_website),r(),d(te(8,6,n.loadingSubject$)?7:-1),r(4),d((a=te(12,8,n.searchResults$))?11:-1,a)}},dependencies:[We,Ne,Ue,Ge,tt,ae,Ee,Ae,it,ie,Ke],data:{animation:[Je]}})};export{nt as AiSearchComponent};
