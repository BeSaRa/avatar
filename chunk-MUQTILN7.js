import{a as nt,b as rt}from"./chunk-XS5A76PE.js";import{a as tt}from"./chunk-S2EZMVDQ.js";import"./chunk-LRSSJ2YS.js";import{b as Ue,c as Qe}from"./chunk-LNWO5OK6.js";import"./chunk-DQUMOBM4.js";import{b as Xe}from"./chunk-VCP5E4SP.js";import{a as at}from"./chunk-O562CNHV.js";import"./chunk-6QFNNE4J.js";import"./chunk-Q3WM7GCC.js";import{g as Ge}from"./chunk-WV4B3HPF.js";import{a as it}from"./chunk-INJDVHFI.js";import"./chunk-6BFTBZPO.js";import{a as et}from"./chunk-IB75ZEMT.js";import{C as Ve,P as je,na as q,oa as Y}from"./chunk-2SSA22JS.js";import{c as We,h as He,l as re,n as qe,s as Ye,t as Ze,u as Ke,z as Je}from"./chunk-5O2HWMRO.js";import"./chunk-OK5S6IU3.js";import{b as Ne,f as Be,g as H}from"./chunk-SKPQZEK7.js";import{$c as R,Ab as L,B as de,Bb as Pe,C as ge,Cc as Oe,Ea as f,Fa as v,Fb as we,Fc as Ae,Ga as b,Gc as D,Ha as te,Hb as ie,Ia as Ce,Ic as ae,Jc as U,Kb as m,Lc as Q,M as ee,Mc as G,Na as ye,Nb as T,Ob as c,Oc as O,Q as ue,Sb as Ie,Tb as g,Ub as ze,V as _e,Vb as j,Wb as z,Xb as k,Xc as Ee,Y as he,Yb as o,Zb as s,_b as u,_c as W,a as ce,b as pe,bc as M,bd as Fe,cc as y,cd as Le,fa as fe,fc as _,ga as ve,hc as p,ia as N,jb as Te,la as I,ma as B,oa as be,od as De,pb as r,q as w,qb as F,qd as ne,r as X,ra as h,rd as Re,s as me,sa as Se,sc as ke,ta as xe,tc as Me,uc as S,va as E,vc as d,wa as V,wc as P,wd as $e,xc as x}from"./chunk-QDEZZFGD.js";var $={facet:"",page_number:1,page_size:10,query:"\u0632\u0648\u0627\u062C",sort:"date"};var Z=class t{http=h(Ne);urlService=h(Be);search(i,e){let a=`${this.urlService.URLS.AI_SEARCH}/${e}`;return this.http.post(a,i)}static \u0275fac=function(e){return new(e||t)};static \u0275prov=I({token:t,factory:t.\u0275fac,providedIn:"root"})};var J=class t{lang=h(H);changes=new w;itemsPerPageLabel=this.lang.locals.items_per_page_label;nextPageLabel=this.lang.locals.next_page_label;previousPageLabel=this.lang.locals.previous_page_label;firstPageLabel=this.lang.locals.first_page_label;lastPageLabel=this.lang.locals.last_page_label;getRangeLabel(i,e,a){if(a===0)return`${this.lang.locals.page} 1 ${this.lang.locals.of} 1`;let n=Math.ceil(a/e);return`${this.lang.locals.page} ${i+1} ${this.lang.locals.of} ${n}`}static \u0275fac=function(e){return new(e||t)};static \u0275prov=I({token:t,factory:t.\u0275fac,providedIn:"root"})};function pt(t,i){if(t&1&&(o(0,"mat-option",17),d(1),s()),t&2){let e=i.$implicit;c("value",e),r(),x(" ",e," ")}}function mt(t,i){if(t&1){let e=y();o(0,"mat-form-field",14)(1,"mat-select",16,0),_("selectionChange",function(n){f(e);let l=p(2);return v(l._changePageSize(n.value))}),z(3,pt,2,2,"mat-option",17,j),s(),o(5,"div",18),_("click",function(){f(e);let n=S(2);return v(n.open())}),s()()}if(t&2){let e=p(2);c("appearance",e._formFieldAppearance)("color",e.color),r(),c("value",e.pageSize)("disabled",e.disabled)("aria-labelledby",e._pageSizeLabelId)("panelClass",e.selectConfig.panelClass||"")("disableOptionCentering",e.selectConfig.disableOptionCentering),r(2),k(e._displayedPageSizeOptions)}}function dt(t,i){if(t&1&&(o(0,"div",15),d(1),s()),t&2){let e=p(2);r(),P(e.pageSize)}}function gt(t,i){if(t&1&&(o(0,"div",3)(1,"div",13),d(2),s(),m(3,mt,6,7,"mat-form-field",14)(4,dt,2,1,"div",15),s()),t&2){let e=p();r(),T("id",e._pageSizeLabelId),r(),x(" ",e._intl.itemsPerPageLabel," "),r(),g(e._displayedPageSizeOptions.length>1?3:-1),r(),g(e._displayedPageSizeOptions.length<=1?4:-1)}}function ut(t,i){if(t&1){let e=y();o(0,"button",19),_("click",function(){f(e);let n=p();return v(n.firstPage())}),b(),o(1,"svg",8),u(2,"path",20),s()()}if(t&2){let e=p();c("matTooltip",e._intl.firstPageLabel)("matTooltipDisabled",e._previousButtonsDisabled())("matTooltipPosition","above")("disabled",e._previousButtonsDisabled()),T("aria-label",e._intl.firstPageLabel)}}function _t(t,i){if(t&1){let e=y();o(0,"button",21),_("click",function(){f(e);let n=p();return v(n.lastPage())}),b(),o(1,"svg",8),u(2,"path",22),s()()}if(t&2){let e=p();c("matTooltip",e._intl.lastPageLabel)("matTooltipDisabled",e._nextButtonsDisabled())("matTooltipPosition","above")("disabled",e._nextButtonsDisabled()),T("aria-label",e._intl.lastPageLabel)}}var A=(()=>{class t{constructor(){this.changes=new w,this.itemsPerPageLabel="Items per page:",this.nextPageLabel="Next page",this.previousPageLabel="Previous page",this.firstPageLabel="First page",this.lastPageLabel="Last page",this.getRangeLabel=(e,a,n)=>{if(n==0||a==0)return`0 of ${n}`;n=Math.max(n,0);let l=e*a,C=l<n?Math.min(l+a,n):l+a;return`${l+1} \u2013 ${C} of ${n}`}}static{this.\u0275fac=function(a){return new(a||t)}}static{this.\u0275prov=I({token:t,factory:t.\u0275fac,providedIn:"root"})}}return t})();function ht(t){return t||new A}var ft={provide:A,deps:[[new Se,new xe,A]],useFactory:ht},vt=50;var bt=new be("MAT_PAGINATOR_DEFAULT_OPTIONS"),St=0,oe=(()=>{class t{get pageIndex(){return this._pageIndex}set pageIndex(e){this._pageIndex=Math.max(e||0,0),this._changeDetectorRef.markForCheck()}get length(){return this._length}set length(e){this._length=e||0,this._changeDetectorRef.markForCheck()}get pageSize(){return this._pageSize}set pageSize(e){this._pageSize=Math.max(e||0,0),this._updateDisplayedPageSizeOptions()}get pageSizeOptions(){return this._pageSizeOptions}set pageSizeOptions(e){this._pageSizeOptions=(e||[]).map(a=>R(a,0)),this._updateDisplayedPageSizeOptions()}constructor(e,a,n){if(this._intl=e,this._changeDetectorRef=a,this._pageSizeLabelId=`mat-paginator-page-size-label-${St++}`,this._isInitialized=!1,this._initializedStream=new me(1),this._pageIndex=0,this._length=0,this._pageSizeOptions=[],this.hidePageSize=!1,this.showFirstLastButtons=!1,this.selectConfig={},this.disabled=!1,this.page=new ye,this.initialized=this._initializedStream,this._intlChanges=e.changes.subscribe(()=>this._changeDetectorRef.markForCheck()),n){let{pageSize:l,pageSizeOptions:C,hidePageSize:se,showFirstLastButtons:le}=n;l!=null&&(this._pageSize=l),C!=null&&(this._pageSizeOptions=C),se!=null&&(this.hidePageSize=se),le!=null&&(this.showFirstLastButtons=le)}this._formFieldAppearance=n?.formFieldAppearance||"outline"}ngOnInit(){this._isInitialized=!0,this._updateDisplayedPageSizeOptions(),this._initializedStream.next()}ngOnDestroy(){this._initializedStream.complete(),this._intlChanges.unsubscribe()}nextPage(){if(!this.hasNextPage())return;let e=this.pageIndex;this.pageIndex=this.pageIndex+1,this._emitPageEvent(e)}previousPage(){if(!this.hasPreviousPage())return;let e=this.pageIndex;this.pageIndex=this.pageIndex-1,this._emitPageEvent(e)}firstPage(){if(!this.hasPreviousPage())return;let e=this.pageIndex;this.pageIndex=0,this._emitPageEvent(e)}lastPage(){if(!this.hasNextPage())return;let e=this.pageIndex;this.pageIndex=this.getNumberOfPages()-1,this._emitPageEvent(e)}hasPreviousPage(){return this.pageIndex>=1&&this.pageSize!=0}hasNextPage(){let e=this.getNumberOfPages()-1;return this.pageIndex<e&&this.pageSize!=0}getNumberOfPages(){return this.pageSize?Math.ceil(this.length/this.pageSize):0}_changePageSize(e){let a=this.pageIndex*this.pageSize,n=this.pageIndex;this.pageIndex=Math.floor(a/e)||0,this.pageSize=e,this._emitPageEvent(n)}_nextButtonsDisabled(){return this.disabled||!this.hasNextPage()}_previousButtonsDisabled(){return this.disabled||!this.hasPreviousPage()}_updateDisplayedPageSizeOptions(){this._isInitialized&&(this.pageSize||(this._pageSize=this.pageSizeOptions.length!=0?this.pageSizeOptions[0]:vt),this._displayedPageSizeOptions=this.pageSizeOptions.slice(),this._displayedPageSizeOptions.indexOf(this.pageSize)===-1&&this._displayedPageSizeOptions.push(this.pageSize),this._displayedPageSizeOptions.sort((e,a)=>e-a),this._changeDetectorRef.markForCheck())}_emitPageEvent(e){this.page.emit({previousPageIndex:e,pageIndex:this.pageIndex,pageSize:this.pageSize,length:this.length})}static{this.\u0275fac=function(a){return new(a||t)(F(A),F(Ee),F(bt,8))}}static{this.\u0275cmp=E({type:t,selectors:[["mat-paginator"]],hostAttrs:["role","group",1,"mat-mdc-paginator"],inputs:{color:"color",pageIndex:[2,"pageIndex","pageIndex",R],length:[2,"length","length",R],pageSize:[2,"pageSize","pageSize",R],pageSizeOptions:"pageSizeOptions",hidePageSize:[2,"hidePageSize","hidePageSize",W],showFirstLastButtons:[2,"showFirstLastButtons","showFirstLastButtons",W],selectConfig:"selectConfig",disabled:[2,"disabled","disabled",W]},outputs:{page:"page"},exportAs:["matPaginator"],standalone:!0,features:[ie,D],decls:14,vars:14,consts:[["selectRef",""],[1,"mat-mdc-paginator-outer-container"],[1,"mat-mdc-paginator-container"],[1,"mat-mdc-paginator-page-size"],[1,"mat-mdc-paginator-range-actions"],["aria-live","polite",1,"mat-mdc-paginator-range-label"],["mat-icon-button","","type","button",1,"mat-mdc-paginator-navigation-first",3,"matTooltip","matTooltipDisabled","matTooltipPosition","disabled"],["mat-icon-button","","type","button",1,"mat-mdc-paginator-navigation-previous",3,"click","matTooltip","matTooltipDisabled","matTooltipPosition","disabled"],["viewBox","0 0 24 24","focusable","false","aria-hidden","true",1,"mat-mdc-paginator-icon"],["d","M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"],["mat-icon-button","","type","button",1,"mat-mdc-paginator-navigation-next",3,"click","matTooltip","matTooltipDisabled","matTooltipPosition","disabled"],["d","M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"],["mat-icon-button","","type","button",1,"mat-mdc-paginator-navigation-last",3,"matTooltip","matTooltipDisabled","matTooltipPosition","disabled"],[1,"mat-mdc-paginator-page-size-label"],[1,"mat-mdc-paginator-page-size-select",3,"appearance","color"],[1,"mat-mdc-paginator-page-size-value"],["hideSingleSelectionIndicator","",3,"selectionChange","value","disabled","aria-labelledby","panelClass","disableOptionCentering"],[3,"value"],[1,"mat-mdc-paginator-touch-target",3,"click"],["mat-icon-button","","type","button",1,"mat-mdc-paginator-navigation-first",3,"click","matTooltip","matTooltipDisabled","matTooltipPosition","disabled"],["d","M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"],["mat-icon-button","","type","button",1,"mat-mdc-paginator-navigation-last",3,"click","matTooltip","matTooltipDisabled","matTooltipPosition","disabled"],["d","M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"]],template:function(a,n){a&1&&(o(0,"div",1)(1,"div",2),m(2,gt,5,4,"div",3),o(3,"div",4)(4,"div",5),d(5),s(),m(6,ut,3,5,"button",6),o(7,"button",7),_("click",function(){return n.previousPage()}),b(),o(8,"svg",8),u(9,"path",9),s()(),te(),o(10,"button",10),_("click",function(){return n.nextPage()}),b(),o(11,"svg",8),u(12,"path",11),s()(),m(13,_t,3,5,"button",12),s()()()),a&2&&(r(2),g(n.hidePageSize?-1:2),r(3),x(" ",n._intl.getRangeLabel(n.pageIndex,n.pageSize,n.length)," "),r(),g(n.showFirstLastButtons?6:-1),r(),c("matTooltip",n._intl.previousPageLabel)("matTooltipDisabled",n._previousButtonsDisabled())("matTooltipPosition","above")("disabled",n._previousButtonsDisabled()),T("aria-label",n._intl.previousPageLabel),r(3),c("matTooltip",n._intl.nextPageLabel)("matTooltipDisabled",n._nextButtonsDisabled())("matTooltipPosition","above")("disabled",n._nextButtonsDisabled()),T("aria-label",n._intl.nextPageLabel),r(3),g(n.showFirstLastButtons?13:-1))},dependencies:[Ge,nt,je,Ue,q],styles:[".mat-mdc-paginator{display:block;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;color:var(--mat-paginator-container-text-color, var(--mat-app-on-surface));background-color:var(--mat-paginator-container-background-color, var(--mat-app-surface));font-family:var(--mat-paginator-container-text-font, var(--mat-app-body-small-font));line-height:var(--mat-paginator-container-text-line-height, var(--mat-app-body-small-line-height));font-size:var(--mat-paginator-container-text-size, var(--mat-app-body-small-size));font-weight:var(--mat-paginator-container-text-weight, var(--mat-app-body-small-weight));letter-spacing:var(--mat-paginator-container-text-tracking, var(--mat-app-body-small-tracking));--mat-form-field-container-height:var(--mat-paginator-form-field-container-height);--mat-form-field-container-vertical-padding:var(--mat-paginator-form-field-container-vertical-padding)}.mat-mdc-paginator .mat-mdc-select-value{font-size:var(--mat-paginator-select-trigger-text-size, var(--mat-app-body-small-size))}.mat-mdc-paginator .mat-mdc-form-field-subscript-wrapper{display:none}.mat-mdc-paginator .mat-mdc-select{line-height:1.5}.mat-mdc-paginator-outer-container{display:flex}.mat-mdc-paginator-container{display:flex;align-items:center;justify-content:flex-end;padding:0 8px;flex-wrap:wrap;width:100%;min-height:var(--mat-paginator-container-size)}.mat-mdc-paginator-page-size{display:flex;align-items:baseline;margin-right:8px}[dir=rtl] .mat-mdc-paginator-page-size{margin-right:0;margin-left:8px}.mat-mdc-paginator-page-size-label{margin:0 4px}.mat-mdc-paginator-page-size-select{margin:0 4px;width:84px}.mat-mdc-paginator-range-label{margin:0 32px 0 24px}.mat-mdc-paginator-range-actions{display:flex;align-items:center}.mat-mdc-paginator-icon{display:inline-block;width:28px;fill:var(--mat-paginator-enabled-icon-color, var(--mat-app-on-surface-variant))}.mat-mdc-icon-button[disabled] .mat-mdc-paginator-icon{fill:var(--mat-paginator-disabled-icon-color)}[dir=rtl] .mat-mdc-paginator-icon{transform:rotate(180deg)}.cdk-high-contrast-active .mat-mdc-icon-button[disabled] .mat-mdc-paginator-icon,.cdk-high-contrast-active .mat-mdc-paginator-icon{fill:currentColor;fill:CanvasText}.cdk-high-contrast-active .mat-mdc-paginator-range-actions .mat-mdc-icon-button{outline:solid 1px}.mat-mdc-paginator-touch-target{display:var(--mat-paginator-touch-target-display);position:absolute;top:50%;left:50%;width:84px;height:48px;background-color:rgba(0,0,0,0);transform:translate(-50%, -50%);cursor:pointer}"],encapsulation:2,changeDetection:0})}}return t})(),ot=(()=>{class t{static{this.\u0275fac=function(a){return new(a||t)}}static{this.\u0275mod=V({type:t})}static{this.\u0275inj=B({providers:[ft],imports:[Qe,rt,Y,oe]})}}return t})();var st=(()=>{class t{static{this.\u0275fac=function(a){return new(a||t)}}static{this.\u0275mod=V({type:t})}static{this.\u0275inj=B({imports:[$e,Ve]})}}return t})();var Ct=["paginator"],yt=(t,i)=>i.chunk_id,Tt=(t,i)=>({$implicit:t,value:i,klass:"truncate max-w-[50%]"}),Pt=(t,i)=>({$implicit:t,value:i}),wt=(t,i)=>({"!truncate":t,"!whitespace-nowrap":i}),lt=t=>({$implicit:t});function It(t,i){if(t&1&&(o(0,"option",10),d(1),s()),t&2){let e=i.$implicit;c("value",e),r(),P(e)}}function zt(t,i){if(t&1&&M(0,12),t&2){p();let e=S(20);c("ngTemplateOutlet",e)}}function kt(t,i){t&1&&M(0)}function Mt(t,i){if(t&1&&m(0,kt,1,0,"ng-container",21),t&2){let e=p(2),a=S(22);c("ngTemplateOutlet",a)("ngTemplateOutletContext",U(2,Tt,e.lang.locals.search_about,e.searchToken()))}}function Ot(t,i){t&1&&M(0)}function At(t,i){if(t&1&&m(0,Ot,1,0,"ng-container",21),t&2){let e=p(2),a=S(22);c("ngTemplateOutlet",a)("ngTemplateOutletContext",U(2,Pt,e.lang.locals.result_count,e.total()))}}function Et(t,i){}function Ft(t,i){t&1&&m(0,Et,0,0,"ng-template")}function Lt(t,i){}function Dt(t,i){t&1&&m(0,Lt,0,0,"ng-template")}function Rt(t,i){if(t&1&&m(0,Ft,1,0,null,21)(1,Dt,1,0,null,21),t&2){let e=p().$implicit;p(2);let a=S(24);c("ngTemplateOutlet",a)("ngTemplateOutletContext",ae(4,lt,e["@search.highlights"].merged_content)),r(),c("ngTemplateOutlet",a)("ngTemplateOutletContext",ae(6,lt,e["@search.highlights"].imageCaption))}}function $t(t,i){t&1&&(b(),o(0,"svg",25),u(1,"path",26),s())}function Nt(t,i){t&1&&(b(),o(0,"svg",25),u(1,"path",27),s())}function Bt(t,i){if(t&1){let e=y();Oe(0),o(1,"div",19)(2,"dt")(3,"a",22),d(4),s(),m(5,Rt,2,8),s(),o(6,"dd",23),d(7),s(),o(8,"button",24),_("click",function(){let n=f(e).$index,l=p(2);return v(l.isTruncatedContent()[n]=!l.isTruncatedContent()[n])}),d(9),m(10,$t,2,0,":svg:svg",25)(11,Nt,2,0,":svg:svg",25),s()()}if(t&2){let e=i.$implicit,a=i.$index,n=p(2),l=n.isTruncatedContent()[a];r(3),c("href",e.ref_url,Te),r(),x(" ",e.title," "),r(),g(e["@search.highlights"]?5:-1),r(),c("ngClass",U(7,wt,l,l)),r(),x(" ",e.chunk," "),r(2),x(" ",l?n.lang.locals.show_more:n.lang.locals.show_less," "),r(),g(l?10:11)}}function Vt(t,i){if(t&1){let e=y();o(0,"div",15)(1,"div",16),m(2,Mt,1,5,"ng-container")(3,At,1,5,"ng-container"),s(),o(4,"div",17)(5,"dl",18),z(6,Bt,12,10,"div",19,yt),s()(),o(8,"mat-paginator",20,5),_("page",function(n){f(e);let l=p();return v(l.onPaginate(n))}),s()()}if(t&2){let e=p();r(2),g(e.searchToken()?2:-1),r(),g(e.total()?3:-1),r(2),c("@fadeInSlideUp",e.animateTrigger()),r(),k(i),r(2),c("pageSizeOptions",e.pageSizeOptions)("pageSize",e.pageSize)("length",e.total())}}function jt(t,i){t&1&&(o(0,"div",28),b(),o(1,"svg",29),u(2,"path",30),s()())}function Ut(t,i){t&1&&(o(0,"div",31)(1,"div",32)(2,"span",33),d(3,"Loading..."),s()()())}function Qt(t,i){if(t&1&&(o(0,"span"),d(1),o(2,"strong"),d(3),s()()),t&2){let e=i.$implicit,a=i.value,n=i.klass;Ie("bg-primary  ",n," text-gray-200 rounded-md text-base px-2.5 py-0.5 border border-primary shadow-gray-200 shadow-sm"),r(),x("",e," : "),r(2),P(a)}}function Gt(t,i){if(t&1&&(o(0,"p"),d(1),s()),t&2){let e=i.$implicit;r(),P(e)}}function Wt(t,i){if(t&1&&(o(0,"div"),z(1,Gt,2,1,"p",null,j),s()),t&2){let e=p().$implicit;r(),k(e)}}function Ht(t,i){if(t&1&&m(0,Wt,3,0,"div"),t&2){let e=i.$implicit;g(e.length>0?0:-1)}}var ct=class t extends et(class{}){paginator=Pe("paginator");aiSearchService=h(Z);store=h(Xe);lang=h(H);chatHistoryService=h(at);botNameCtrl=new re("",{nonNullable:!0});botNames$=this.chatHistoryService.getAllBotNames().pipe(N(i=>this.botNameCtrl.patchValue(i.at(0))));searchForm=new re("",{nonNullable:!0});loadingSubject$=new w;search$=new X("");paginate$=new X({page_number:$.page_number,page_size:$.page_size});total=L(0);searchToken=L("");searchResults$=this.load();isTruncatedContent=L([]);pageSizeOptions=[5,10,20,30,40,50,100];pageSize=$.page_size;animateTrigger=L(!1);storeEffect=Le(()=>{this.store.isRecordingStopped()&&Fe(()=>{this.prepareForSearch(this.searchForm.value)})});ngOnInit(){this.listenToSearch()}load(){return ge([this.search$,this.paginate$]).pipe(ee(([i])=>i.trim().length>0),N(([i])=>this.searchToken.set(i)),fe(([i,e])=>{let a=pe(ce({},$),{page_number:e.page_number,page_size:e.page_size,query:i});return this.loadingSubject$.next(!0),this.aiSearchService.search(a,this.botNameCtrl.value).pipe(he(()=>this.loadingSubject$.next(!1)))}),N(({total_count:i,rs:e})=>{this.total.set(i),this.isTruncatedContent.set(Array.from({length:e?.length??0},()=>!0)),this.animateTrigger.set(!this.animateTrigger())}),de(i=>i.rs))}onPaginate(i){this.paginate$.next({page_number:i.pageIndex+1,page_size:i.pageSize})}listenToSearch(){this.searchForm.valueChanges.pipe(ve(this.destroy$),_e(),ue(400),ee(i=>i.trim().length>0&&this.store.isRecordingStopped())).subscribe(i=>{this.prepareForSearch(i,!1)})}resetPaginator(){this.paginator()&&(this.paginator().pageIndex=0,this.paginator()._changePageSize(this.paginator().pageSize))}prepareForSearch(i,e=!0){this.resetPaginator(),this.search$.next(i),e&&this.searchForm.reset("",{emitEvent:!1})}static \u0275fac=(()=>{let i;return function(a){return(i||(i=Ce(t)))(a||t)}})();static \u0275cmp=E({type:t,selectors:[["app-ai-search"]],viewQuery:function(e,a){e&1&&ke(a.paginator,Ct,5),e&2&&Me()},standalone:!0,features:[Ae([{provide:A,useClass:J}]),we,D],decls:25,vars:15,consts:[["recorder",""],["searchIcon",""],["spinnerIcon",""],["badge",""],["highlightOptions",""],["paginator",""],[1,"flex","flex-col","justify-center","items-center","gap-4"],[1,"text-gray-200","text-lg"],[1,"flex","justify-center","items-center","gap-4","w-full"],[1,"p-1","w-24","text-sm","border-b-2","bg-transparent","border-gray-400","focus:ring-primary","focus:border-primary","outline-none",3,"matTooltip","matTooltipClass","formControl"],[1,"text-gray-700",3,"value"],[1,"relative","flex","gap-2","w-6/12"],[3,"ngTemplateOutlet"],["type","text","tabindex","1",1,"block","w-full","p-3","ps-10","pe-12","text-lg","text-gray-700","border","border-gray-300","rounded-lg","bg-gray-100","focus:ring-gray-400","focus:border-gray-400","focus:ring-4","outline-none","ring-2","ring-gray-500",3,"formControl","placeholder"],[3,"recognized$","recognizing$"],[1,"container","m-2"],[1,"flex","justify-start","items-center","gap-2","mb-2"],[1,"flex","justify-center","items-center"],[1,"bg-gray-200","shadow-gray-200","overflow-hidden","relative","shadow-sm","w-full","rounded-md","border-gray-400","border","p-4","text-gray-700"],[1,"flex","flex-col","border-b","last-of-type:border-none","border-gray-400","p-2","space-y-3"],[1,"rounded-md","sticky","bottom-0","border-2","border-gray-700","mt-3","[&_div.mat-mdc-paginator-outer-container]:bg-gray-200","[&_div.mat-mdc-paginator-outer-container]:rounded-md","[&_div.mat-mdc-paginator-outer-container_div.mat-mdc-paginator-container]:justify-center",3,"page","pageSizeOptions","pageSize","length"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["target","_blank",1,"font-semibold","text-primary","underline","cursor-pointer",3,"href"],[3,"ngClass"],["type","button",1,"text-blue-600","outline-none","text-base","bg-transparent","underline","flex","justify-start","items-center","gap-1",3,"click"],["xmlns","http://www.w3.org/2000/svg","fill","currentColor","viewBox","0 0 24 24",1,"size-6"],["d","M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"],["d","M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"],[1,"absolute","inset-y-0","start-0","flex","items-center","ps-3","pointer-events-none"],["aria-hidden","true","xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 20 20",1,"w-4","h-4","text-gray-500"],["stroke","currentColor","stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"],[1,"absolute","inset-y-0","end-0","flex","items-center","pe-3","pointer-events-none"],["role","status","aria-label","loading",1,"animate-spin","inline-block","size-6","border-[3px]","border-current","border-t-transparent","text-primary","rounded-full"],[1,"sr-only"]],template:function(e,a){if(e&1){let n=y();o(0,"div",6)(1,"h5",7),d(2),s(),o(3,"div",8)(4,"select",9),z(5,It,2,2,"option",10,ze),Q(7,"async"),s(),o(8,"div",11),M(9,12),u(10,"input",13),m(11,zt,1,1,"ng-container",12),Q(12,"async"),s(),o(13,"app-recorder",14,0),_("recognized$",function(C){return f(n),v(a.searchForm.setValue(C))})("recognizing$",function(C){return f(n),v(a.searchForm.setValue(C))}),s()()(),m(15,Vt,10,6,"div",15),Q(16,"async"),m(17,jt,3,0,"ng-template",null,1,O)(19,Ut,4,0,"ng-template",null,2,O)(21,Qt,4,5,"ng-template",null,3,O)(23,Ht,1,1,"ng-template",null,4,O)}if(e&2){let n,l=S(18);r(2),P(a.lang.locals.search_message),r(2),c("matTooltip",a.lang.locals.change_bot+`
`+a.lang.locals.change_bot_note)("matTooltipClass","whitespace-pre-line")("formControl",a.botNameCtrl),r(),k(G(7,9,a.botNames$)),r(4),c("ngTemplateOutlet",l),r(),c("formControl",a.searchForm)("placeholder",a.lang.locals.search_in_website),r(),g(G(12,11,a.loadingSubject$)?11:-1),r(4),g((n=G(16,13,a.searchResults$))?15:-1,n)}},dependencies:[Je,Ze,Ke,We,Ye,He,qe,ot,oe,Re,De,st,ne,tt,Y,q],data:{animation:[it]}})};export{ct as AiSearchComponent};
