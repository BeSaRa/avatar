import{V as n}from"./chunk-R5IGY7WS.js";import{a as s,e as i}from"./chunk-TG2TJZEI.js";import{_ as a,ba as o,ha as e}from"./chunk-X3RIXLBK.js";var c=class r{urlService=e(i);http=e(s);store=e(n);startStream(){return this.http.post(this.urlService.URLS.AVATAR+"/start-stream",{},{params:{size:"life-size"}}).pipe(a(t=>this.store.updateStreamId(t.data.id)))}closeStream(){let t=this.store.streamId();return this.store.updateStreamId(""),this.http.delete(this.urlService.URLS.AVATAR+`/close-stream/${t}`)}sendCandidate(t){return this.http.post(this.urlService.URLS.AVATAR+`/send-candidate/${this.store.streamId()}`,{candidate:t})}sendAnswer(t){return this.http.put(this.urlService.URLS.AVATAR+`/send-answer/${this.store.streamId()}`,{answer:t})}interruptAvatar(){return this.http.delete(this.urlService.URLS.AVATAR+`/stop-render/${this.store.streamId()}`)}renderText(){return this.http.post(this.urlService.URLS.AVATAR+`/render-text/${this.store.streamId()}`,{})}static \u0275fac=function(p){return new(p||r)};static \u0275prov=o({token:r,factory:r.\u0275fac,providedIn:"root"})};var m=class r{http=e(s);urlService=e(i);appStore=e(n);generateSpeechToken(){return this.http.get(this.urlService.URLS.SPEECH_TOKEN).pipe(a(t=>this.appStore.updateSpeechToken(t)))}static \u0275fac=function(p){return new(p||r)};static \u0275prov=o({token:r,factory:r.\u0275fac,providedIn:"root"})};export{c as a,m as b};
