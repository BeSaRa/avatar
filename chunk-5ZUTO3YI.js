import{a as S}from"./chunk-2VS4TF6N.js";import{b as x}from"./chunk-ATB2QM7G.js";import{c as M,d as I,e as w}from"./chunk-JN2FAFAE.js";import{l as T}from"./chunk-3POO7YO6.js";import{b as v,f as y}from"./chunk-CXLFYQYW.js";import{B as c,H as C,O as g,V as d,a as u,ea as b,ha as f,ka as h,qa as l,x as p}from"./chunk-5242NRUX.js";function A(o){return class extends o{clone(r){let s=this.constructor;return Object.assign(new s,this,r)}}}var m=class{context;conversation_id;content;role;id;constructor(){this.id=M()}isUser(){return this.role==="user"}isAssistant(){return this.role==="assistant"}isError(){return this.role==="error"}};var a=class extends A(m){constructor(r="",s="user"){super();this.content=r;this.role=s}end_turn;function_call;tool_calls};var R=class o{http=l(v);urlService=l(y);adminService=l(S);store=l(x);botNameCtrl=new T("website",{nonNullable:!0});sendMessage(e,r){let s=`${this.urlService.URLS.CHAT}/${r}`;return this.messages.update(t=>[...t,new a(e,"user")]),this.http.post(s,u(u({messages:this.messages()},this.store.streamId()?{stream_id:this.store.streamId()}:null),this.conversationId()?{conversation_id:this.conversationId()}:null)).pipe(g(t=>{throw new a().clone({content:t.message,role:"error"}),new Error(t)}),c(t=>(t.message.content=w(t.message.content,t.message),t)),b(t=>this.processFormattedText(t.message.content).pipe(c(n=>(t.message.content=I(n),t.message=new a().clone(t.message),this.conversationId.set(t.message.conversation_id),this.messages.update(i=>[...i,t.message]),t)))))}processFormattedText(e){let r=[...e.matchAll(/href="(.*?)"/g)];if(r.length===0)return console.log("No matches found in formatted text."),p(e);let s=r.map(t=>{let n=t[1];return n.includes("blob.core.windows.net")?this.adminService.secureUrl(n).pipe(c(i=>({match:t[0],replacement:t[0].replace(n,i)})),g(()=>p({match:t[0],replacement:t[0]}))):p({match:t[0],replacement:t[0]})});return C(s).pipe(c(t=>(t.forEach(({match:n,replacement:i})=>{e=e.replace(n,i)}),e)))}onBotNameChange(){return this.botNameCtrl.valueChanges.pipe(d(),f(()=>{this.conversationId.set(""),this.messages.set([])}))}static \u0275fac=function(r){return new(r||o)};static \u0275prov=h({token:o,factory:o.\u0275fac,providedIn:"root"})};export{m as a,a as b,R as c};
