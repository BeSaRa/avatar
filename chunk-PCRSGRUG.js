import{b as w}from"./chunk-ZPRGCDHT.js";import{a as A}from"./chunk-DNPOOQKF.js";import{a as I}from"./chunk-5PTZG25G.js";import{d as S,e as x}from"./chunk-L4GXIFO4.js";import{l as y}from"./chunk-SLIRYUJ2.js";import{a as T}from"./chunk-UR3XF2OI.js";import{c as v,f as M}from"./chunk-7UCX2ERW.js";import{B as l,H as d,P as m,W as g,X as h,a as C,ka as f,na as b,ta as p,x as u}from"./chunk-OUJ2UPQI.js";function R(i){return class extends i{clone(r){let s=this.constructor;return Object.assign(new s,this,r)}}}var c=class extends R(I){constructor(r="",s="user"){super();this.content=r;this.role=s}end_turn;function_call;tool_calls};var O=class i{http=p(M);urlService=p(T);adminService=p(A);store=p(w);botNameCtrl=new y("",{nonNullable:!0});sendMessage(t,r){let s=`${this.urlService.URLS.CHAT}/${r}`;return this.messages.update(e=>[...e,new c(t,"user")]),this.http.post(s,C(C({messages:this.messages()},this.store.streamId()?{stream_id:this.store.streamId()}:null),this.conversationId()?{conversation_id:this.conversationId()}:null)).pipe(m(e=>{throw new c().clone({content:e.message,role:"error"}),new Error(e)}),l(e=>(e.message.content=S(x(e.message.content,e.message)),e.message=new c().clone(e.message),this.conversationId.set(e.message.conversation_id),this.messages.update(n=>[...n,e.message]),e)))}processFormattedText(t){let r=[...t.matchAll(/href="(.*?)"/g)];if(r.length===0)return console.log("No matches found in formatted text."),u(t);let s=r.map(e=>{let n=e[1];return n.includes("blob.core.windows.net")?this.adminService.secureUrl(n).pipe(l(a=>({match:e[0],replacement:e[0].replace(n,a)})),m(()=>u({match:e[0],replacement:e[0]}))):u({match:e[0],replacement:e[0]})});return d(s).pipe(l(e=>(e.forEach(({match:n,replacement:a})=>{t=t.replace(n,a)}),t)))}onBotNameChange(){return this.botNameCtrl.valueChanges.pipe(g(),f(()=>{this.conversationId.set(""),this.messages.set([])}))}uploadDocument(t,r,s){let e=`${this.urlService.URLS.CHATBOT_UPLOAD_DOCUMENT}`,n=new FormData;Array.from(t).forEach(o=>{n.append("files",o,o.name)});let a=new v().set("bot_name",r);return s&&(a=a.set("conversation_id",s)),this.http.post(e,n,{params:a}).pipe(l(o=>(this.conversationId.set(o.data||""),o.data)),h(()=>this.sendMessage("summarize",r).pipe(m(o=>{throw console.error("Error sending summarize message:",o),o}))),m(o=>{throw console.error("Error uploading document:",o),o}))}static \u0275fac=function(r){return new(r||i)};static \u0275prov=b({token:i,factory:i.\u0275fac,providedIn:"root"})};export{R as a,c as b,O as c};
