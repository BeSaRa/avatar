import{b as m}from"./chunk-VCP5E4SP.js";import{b as n,f as l}from"./chunk-SKPQZEK7.js";import{a,ia as i,la as o,ra as e}from"./chunk-QDEZZFGD.js";var c=class r{urlService=e(l);http=e(n);store=e(m);startStream(t){return this.http.post(this.urlService.URLS.AVATAR+"/start-stream",{},{params:a({},t?{size:"life-size"}:void 0)}).pipe(i(s=>this.store.updateStreamId(s.data.id)))}closeStream(){let t=this.store.streamId();return this.store.updateStreamId(""),this.http.delete(this.urlService.URLS.AVATAR+`/close-stream/${t}`)}sendCandidate(t){return this.http.post(this.urlService.URLS.AVATAR+`/send-candidate/${this.store.streamId()}`,{candidate:t})}sendAnswer(t){return this.http.put(this.urlService.URLS.AVATAR+`/send-answer/${this.store.streamId()}`,{answer:t})}interruptAvatar(){return this.http.delete(this.urlService.URLS.AVATAR+`/stop-render/${this.store.streamId()}`)}renderText(){return this.http.post(this.urlService.URLS.AVATAR+`/render-text/${this.store.streamId()}`,{})}static \u0275fac=function(s){return new(s||r)};static \u0275prov=o({token:r,factory:r.\u0275fac,providedIn:"root"})};export{c as a};
