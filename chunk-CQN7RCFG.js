import{b as C}from"./chunk-P26C5AWD.js";import{b as d,c as g,d as f}from"./chunk-NRYOFJMS.js";import{b as m,f as u}from"./chunk-GXN6FYK5.js";import{A as c,M as l,a as i,ha as p,na as n,vb as a}from"./chunk-7HTXMH5V.js";function h(t){return class extends t{clone(e){let s=this.constructor;return Object.assign(new s,this,e)}}}var o=class extends h(f){constructor(e="",s="user"){super();this.content=e;this.role=s}end_turn;function_call;tool_calls};var b=class t{http=n(m);urlService=n(u);store=n(C);messages=a([]);status=a(!1);conversationId=a("");sendMessage(r){return this.messages.update(e=>[...e,new o(r,"user")]),this.http.post(this.urlService.URLS.CHAT,i(i({messages:this.messages()},this.store.streamId()?{stream_id:this.store.streamId()}:null),this.conversationId()?{conversation_id:this.conversationId()}:null)).pipe(l(e=>{throw new o().clone({content:e.message,role:"error"}),new Error(e)})).pipe(c(e=>(e.message.content=d(g(e.message.content,e.message)),e.message=new o().clone(e.message),this.conversationId.set(e.message.conversation_id),this.messages.update(s=>[...s,e.message]),e)))}static \u0275fac=function(e){return new(e||t)};static \u0275prov=p({token:t,factory:t.\u0275fac,providedIn:"root"})};export{b as a};
