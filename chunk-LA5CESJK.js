import{b as Y}from"./chunk-PMUIQYPP.js";import{b as G}from"./chunk-ZPRGCDHT.js";import{b as v}from"./chunk-L4GXIFO4.js";import{a as J}from"./chunk-HDLOXU5R.js";import{b as W}from"./chunk-UR3XF2OI.js";import{Ad as U,B as f,Bc as V,Cc as k,Dc as x,Eb as C,Jb as F,La as R,M as D,N as I,Nc as N,Ob as y,P as O,Pc as j,Qc as B,Rc as h,Sc as H,Tb as $,Tc as Q,Ua as P,Ub as r,X as T,Zb as w,cc as m,dc as d,ec as u,ha as o,hd as A,i as _,ia as g,ka as p,nc as b,s as S,sb as s,ta as c,vd as q,w as l,xa as L,yc as E,zc as M}from"./chunk-OUJ2UPQI.js";var Z=["video"],ee=["idleVideo"],te=i=>({"scale-50 left-0":i}),K=(i,n,t)=>({"bg-red-600":i,"bg-green-700":n,"bg-orange-500":t}),ie=(i,n,t)=>({"h-full":i,"w-full":n,"overflow-hidden":t}),ne=(i,n)=>({"h-full":i,"w-full":n});function ae(i,n){if(i&1&&(m(0,"span",7),V(1),d()),i&2){let t=b();s(),k(t.onlineStatus())}}function se(i,n){if(i&1&&(m(0,"video",9,1),u(2,"source",10),d()),i&2){let t=b();r("ngClass",B(2,ne,t.hasSize(),!t.hasSize()))("hidden",t.store.isStreamStarted())}}var X=class i extends J(class{}){size=P();hasSize=A(()=>!!this.size());fullWidth="w-full h-full block ";video=C.required("video");idleVideo=C("idleVideo");avatarService=c(Y);lang=c(W);start$=new S(1);stop$=new S(1);store=c(G);init$=this.start$.asObservable().pipe(p(()=>this.store.updateStreamStatus("InProgress"))).pipe(g(this.destroy$)).pipe(T(()=>this.avatarService.startStream(this.size()).pipe(O(n=>{throw this.store.updateStreamStatus("Stopped"),n})).pipe(v()))).pipe(o(n=>{let{data:{webrtcData:{offer:t,iceServers:e}}}=n;return this.pc=new RTCPeerConnection({iceServers:e,iceTransportPolicy:"relay"}),this.pc.addEventListener("icecandidate",a=>{a.candidate&&this.avatarService.sendCandidate(a.candidate).subscribe()}),this.pc.addEventListener("icegatheringstatechange",a=>{a.target.iceGatheringState=="complete"&&this.video().nativeElement.paused&&(this.video().nativeElement.play().then(),this.store.updateStreamStatus("Started"))}),this.pc.addEventListener("track",a=>{this.video().nativeElement.srcObject=a.streams[0]}),this.pc.addEventListener("connectionstatechange",a=>{let z=a.target.connectionState;z==="connected"&&this.store.updateStreamStatus("Started"),z==="disconnected"&&this.store.updateStreamStatus("Stopped")}),l(this.pc.setRemoteDescription(new RTCSessionDescription(t))).pipe(o(()=>l(this.pc.createAnswer()))).pipe(o(a=>l(this.pc.setLocalDescription(a)).pipe(f(()=>a)))).pipe(o(a=>this.avatarService.sendAnswer(a)))})).pipe(f(()=>""));onlineStatus=A(()=>{switch(this.lang.localChange(),this.store.streamingStatus()){case"Started":return this.lang.locals.connected;case"InProgress":return this.lang.locals.connecting;case"Disconnecting":return this.lang.locals.disconnecting;default:return this.lang.locals.not_connected}});ngOnInit(){return _(this,null,function*(){this.store.updateStreamStatus("Stopped"),D(this.destroy$).pipe(p(()=>this.store.updateStreamStatus("Stopped"))).pipe(o(()=>this.avatarService.closeStream().pipe(v()))).subscribe(()=>{console.log("COMPONENT DESTROYED")}),this.stop$.pipe(I(()=>this.store.hasStream())).pipe(p(()=>this.store.updateStreamStatus("Disconnecting"))).pipe(g(this.destroy$)).pipe(o(()=>this.avatarService.closeStream().pipe(v()))).subscribe(()=>{this.store.updateStreamStatus("Stopped"),console.log("MANUAL CLOSE")}),this.size()||this.start$.next()})}ngAfterViewInit(){this.playIdle()}playIdle(){this.idleVideo()&&this.idleVideo()?.nativeElement&&(this.idleVideo().nativeElement.src="assets/videos/idle-full.webm",this.idleVideo().nativeElement.muted=!0,this.idleVideo().nativeElement.loop=!0,this.idleVideo().nativeElement.play().then())}static \u0275fac=(()=>{let n;return function(e){return(n||(n=R(i)))(e||i)}})();static \u0275cmp=L({type:i,selectors:[["app-avatar-video"]],viewQuery:function(t,e){t&1&&(E(e.video,Z,5),E(e.idleVideo,ee,5)),t&2&&M(2)},hostVars:1,hostBindings:function(t,e){t&2&&$("class",e.fullWidth)},inputs:{size:[1,"size"]},standalone:!0,features:[F,N],decls:11,vars:24,consts:[["video",""],["idleVideo",""],["id","video-wrapper",1,"flex","items-center","w-full","h-full","justify-center"],[1,"flex","flex-col","items-center","w-full","h-full","justify-center","absolute"],[1,"flex","gap-1","shadow-2xl","shadow-white","bg-black/20","p-1","mt-2","absolute","z-50","top-0","rounded-md",3,"ngClass"],[1,"p-4","rounded-full",3,"ngClass"],[1,"p-4","absolute","pulse","rounded-full",3,"ngClass"],[1,"text-white","font-semibold"],["autoplay","",3,"hidden","ngClass"],[3,"ngClass","hidden"],["src","assets/videos/idle-full.webm","type","video/webm"]],template:function(t,e){t&1&&(m(0,"div",2)(1,"div",3)(2,"div",4),u(3,"div",5)(4,"div",6),y(5,ae,2,1,"span",7),d(),u(6,"video",8,0),y(8,se,3,5,"video",9),d(),V(9),H(10,"async"),d()),t&2&&(s(2),r("ngClass",j(10,te,!e.hasSize())),s(),r("ngClass",h(12,K,e.store.isStreamStopped(),e.store.isStreamStarted(),e.store.isStreamLoading())),s(),r("ngClass",h(16,K,e.store.isStreamStopped(),e.store.isStreamStarted(),e.store.isStreamLoading())),s(),w(e.hasSize()?5:-1),s(),r("hidden",e.store.isStreamStopped()||e.store.isStreamLoading())("ngClass",h(20,ie,e.hasSize(),!e.hasSize(),!e.hasSize())),s(2),w(e.hasSize()?8:-1),s(),x(" ",Q(10,8,e.init$),`
`))},dependencies:[U,q]})};export{X as a};
