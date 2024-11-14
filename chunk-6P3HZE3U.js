import{Cc as T,Dc as ee,Ea as Re,Ec as Ne,Fa as Pe,H as ye,Ha as Se,K as me,Kc as K,Oc as Oe,Qa as Ie,S as Te,Wc as ke,_ as X,a as d,b as D,ba as J,ca as ve,ea as w,g as Z,h as fe,ha as M,ja as I,k as Q,ka as y,o as pe,rb as Ae,s as ge,sa as we,sb as V,t as H,ua as Ee,va as be,x as L}from"./chunk-ZX6EAOVH.js";var _=class{},C=class{},b=class n{constructor(e){this.normalizedNames=new Map,this.lazyUpdate=null,e?typeof e=="string"?this.lazyInit=()=>{this.headers=new Map,e.split(`
`).forEach(t=>{let r=t.indexOf(":");if(r>0){let s=t.slice(0,r),i=s.toLowerCase(),o=t.slice(r+1).trim();this.maybeSetNormalizedName(s,i),this.headers.has(i)?this.headers.get(i).push(o):this.headers.set(i,[o])}})}:typeof Headers<"u"&&e instanceof Headers?(this.headers=new Map,e.forEach((t,r)=>{this.setHeaderEntries(r,t)})):this.lazyInit=()=>{this.headers=new Map,Object.entries(e).forEach(([t,r])=>{this.setHeaderEntries(t,r)})}:this.headers=new Map}has(e){return this.init(),this.headers.has(e.toLowerCase())}get(e){this.init();let t=this.headers.get(e.toLowerCase());return t&&t.length>0?t[0]:null}keys(){return this.init(),Array.from(this.normalizedNames.values())}getAll(e){return this.init(),this.headers.get(e.toLowerCase())||null}append(e,t){return this.clone({name:e,value:t,op:"a"})}set(e,t){return this.clone({name:e,value:t,op:"s"})}delete(e,t){return this.clone({name:e,value:t,op:"d"})}maybeSetNormalizedName(e,t){this.normalizedNames.has(t)||this.normalizedNames.set(t,e)}init(){this.lazyInit&&(this.lazyInit instanceof n?this.copyFrom(this.lazyInit):this.lazyInit(),this.lazyInit=null,this.lazyUpdate&&(this.lazyUpdate.forEach(e=>this.applyUpdate(e)),this.lazyUpdate=null))}copyFrom(e){e.init(),Array.from(e.headers.keys()).forEach(t=>{this.headers.set(t,e.headers.get(t)),this.normalizedNames.set(t,e.normalizedNames.get(t))})}clone(e){let t=new n;return t.lazyInit=this.lazyInit&&this.lazyInit instanceof n?this.lazyInit:this,t.lazyUpdate=(this.lazyUpdate||[]).concat([e]),t}applyUpdate(e){let t=e.name.toLowerCase();switch(e.op){case"a":case"s":let r=e.value;if(typeof r=="string"&&(r=[r]),r.length===0)return;this.maybeSetNormalizedName(e.name,t);let s=(e.op==="a"?this.headers.get(t):void 0)||[];s.push(...r),this.headers.set(t,s);break;case"d":let i=e.value;if(!i)this.headers.delete(t),this.normalizedNames.delete(t);else{let o=this.headers.get(t);if(!o)return;o=o.filter(c=>i.indexOf(c)===-1),o.length===0?(this.headers.delete(t),this.normalizedNames.delete(t)):this.headers.set(t,o)}break}}setHeaderEntries(e,t){let r=(Array.isArray(t)?t:[t]).map(i=>i.toString()),s=e.toLowerCase();this.headers.set(s,r),this.maybeSetNormalizedName(e,s)}forEach(e){this.init(),Array.from(this.normalizedNames.keys()).forEach(t=>e(this.normalizedNames.get(t),this.headers.get(t)))}};var ne=class{encodeKey(e){return Le(e)}encodeValue(e){return Le(e)}decodeKey(e){return decodeURIComponent(e)}decodeValue(e){return decodeURIComponent(e)}};function Ge(n,e){let t=new Map;return n.length>0&&n.replace(/^\?/,"").split("&").forEach(s=>{let i=s.indexOf("="),[o,c]=i==-1?[e.decodeKey(s),""]:[e.decodeKey(s.slice(0,i)),e.decodeValue(s.slice(i+1))],a=t.get(o)||[];a.push(c),t.set(o,a)}),t}var qe=/%(\d[a-f0-9])/gi,Ye={40:"@","3A":":",24:"$","2C":",","3B":";","3D":"=","3F":"?","2F":"/"};function Le(n){return encodeURIComponent(n).replace(qe,(e,t)=>Ye[t]??e)}function $(n){return`${n}`}var N=class n{constructor(e={}){if(this.updates=null,this.cloneFrom=null,this.encoder=e.encoder||new ne,e.fromString){if(e.fromObject)throw new Error("Cannot specify both fromString and fromObject.");this.map=Ge(e.fromString,this.encoder)}else e.fromObject?(this.map=new Map,Object.keys(e.fromObject).forEach(t=>{let r=e.fromObject[t],s=Array.isArray(r)?r.map($):[$(r)];this.map.set(t,s)})):this.map=null}has(e){return this.init(),this.map.has(e)}get(e){this.init();let t=this.map.get(e);return t?t[0]:null}getAll(e){return this.init(),this.map.get(e)||null}keys(){return this.init(),Array.from(this.map.keys())}append(e,t){return this.clone({param:e,value:t,op:"a"})}appendAll(e){let t=[];return Object.keys(e).forEach(r=>{let s=e[r];Array.isArray(s)?s.forEach(i=>{t.push({param:r,value:i,op:"a"})}):t.push({param:r,value:s,op:"a"})}),this.clone(t)}set(e,t){return this.clone({param:e,value:t,op:"s"})}delete(e,t){return this.clone({param:e,value:t,op:"d"})}toString(){return this.init(),this.keys().map(e=>{let t=this.encoder.encodeKey(e);return this.map.get(e).map(r=>t+"="+this.encoder.encodeValue(r)).join("&")}).filter(e=>e!=="").join("&")}clone(e){let t=new n({encoder:this.encoder});return t.cloneFrom=this.cloneFrom||this,t.updates=(this.updates||[]).concat(e),t}init(){this.map===null&&(this.map=new Map),this.cloneFrom!==null&&(this.cloneFrom.init(),this.cloneFrom.keys().forEach(e=>this.map.set(e,this.cloneFrom.map.get(e))),this.updates.forEach(e=>{switch(e.op){case"a":case"s":let t=(e.op==="a"?this.map.get(e.param):void 0)||[];t.push($(e.value)),this.map.set(e.param,t);break;case"d":if(e.value!==void 0){let r=this.map.get(e.param)||[],s=r.indexOf($(e.value));s!==-1&&r.splice(s,1),r.length>0?this.map.set(e.param,r):this.map.delete(e.param)}else{this.map.delete(e.param);break}}}),this.cloneFrom=this.updates=null)}};var re=class{constructor(){this.map=new Map}set(e,t){return this.map.set(e,t),this}get(e){return this.map.has(e)||this.map.set(e,e.defaultValue()),this.map.get(e)}delete(e){return this.map.delete(e),this}has(e){return this.map.has(e)}keys(){return this.map.keys()}};function Ze(n){switch(n){case"DELETE":case"GET":case"HEAD":case"OPTIONS":case"JSONP":return!1;default:return!0}}function Me(n){return typeof ArrayBuffer<"u"&&n instanceof ArrayBuffer}function xe(n){return typeof Blob<"u"&&n instanceof Blob}function De(n){return typeof FormData<"u"&&n instanceof FormData}function Qe(n){return typeof URLSearchParams<"u"&&n instanceof URLSearchParams}var F=class n{constructor(e,t,r,s){this.url=t,this.body=null,this.reportProgress=!1,this.withCredentials=!1,this.responseType="json",this.method=e.toUpperCase();let i;if(Ze(this.method)||s?(this.body=r!==void 0?r:null,i=s):i=r,i&&(this.reportProgress=!!i.reportProgress,this.withCredentials=!!i.withCredentials,i.responseType&&(this.responseType=i.responseType),i.headers&&(this.headers=i.headers),i.context&&(this.context=i.context),i.params&&(this.params=i.params),this.transferCache=i.transferCache),this.headers??=new b,this.context??=new re,!this.params)this.params=new N,this.urlWithParams=t;else{let o=this.params.toString();if(o.length===0)this.urlWithParams=t;else{let c=t.indexOf("?"),a=c===-1?"?":c<t.length-1?"&":"";this.urlWithParams=t+a+o}}}serializeBody(){return this.body===null?null:typeof this.body=="string"||Me(this.body)||xe(this.body)||De(this.body)||Qe(this.body)?this.body:this.body instanceof N?this.body.toString():typeof this.body=="object"||typeof this.body=="boolean"||Array.isArray(this.body)?JSON.stringify(this.body):this.body.toString()}detectContentTypeHeader(){return this.body===null||De(this.body)?null:xe(this.body)?this.body.type||null:Me(this.body)?null:typeof this.body=="string"?"text/plain":this.body instanceof N?"application/x-www-form-urlencoded;charset=UTF-8":typeof this.body=="object"||typeof this.body=="number"||typeof this.body=="boolean"?"application/json":null}clone(e={}){let t=e.method||this.method,r=e.url||this.url,s=e.responseType||this.responseType,i=e.transferCache??this.transferCache,o=e.body!==void 0?e.body:this.body,c=e.withCredentials??this.withCredentials,a=e.reportProgress??this.reportProgress,f=e.headers||this.headers,g=e.params||this.params,m=e.context??this.context;return e.setHeaders!==void 0&&(f=Object.keys(e.setHeaders).reduce((E,u)=>E.set(u,e.setHeaders[u]),f)),e.setParams&&(g=Object.keys(e.setParams).reduce((E,u)=>E.set(u,e.setParams[u]),g)),new n(t,r,o,{params:g,headers:f,context:m,reportProgress:a,responseType:s,withCredentials:c,transferCache:i})}},O=function(n){return n[n.Sent=0]="Sent",n[n.UploadProgress=1]="UploadProgress",n[n.ResponseHeader=2]="ResponseHeader",n[n.DownloadProgress=3]="DownloadProgress",n[n.Response=4]="Response",n[n.User=5]="User",n}(O||{}),B=class{constructor(e,t=200,r="OK"){this.headers=e.headers||new b,this.status=e.status!==void 0?e.status:t,this.statusText=e.statusText||r,this.url=e.url||null,this.ok=this.status>=200&&this.status<300}},W=class n extends B{constructor(e={}){super(e),this.type=O.ResponseHeader}clone(e={}){return new n({headers:e.headers||this.headers,status:e.status!==void 0?e.status:this.status,statusText:e.statusText||this.statusText,url:e.url||this.url||void 0})}},z=class n extends B{constructor(e={}){super(e),this.type=O.Response,this.body=e.body!==void 0?e.body:null}clone(e={}){return new n({body:e.body!==void 0?e.body:this.body,headers:e.headers||this.headers,status:e.status!==void 0?e.status:this.status,statusText:e.statusText||this.statusText,url:e.url||this.url||void 0})}},A=class extends B{constructor(e){super(e,0,"Unknown Error"),this.name="HttpErrorResponse",this.ok=!1,this.status>=200&&this.status<300?this.message=`Http failure during parsing for ${e.url||"(unknown url)"}`:this.message=`Http failure response for ${e.url||"(unknown url)"}: ${e.status} ${e.statusText}`,this.error=e.error||null}},_e=200,He=204;function te(n,e){return{body:e,headers:n.headers,context:n.context,observe:n.observe,params:n.params,reportProgress:n.reportProgress,responseType:n.responseType,withCredentials:n.withCredentials,transferCache:n.transferCache}}var ce=(()=>{class n{constructor(t){this.handler=t}request(t,r,s={}){let i;if(t instanceof F)i=t;else{let a;s.headers instanceof b?a=s.headers:a=new b(s.headers);let f;s.params&&(s.params instanceof N?f=s.params:f=new N({fromObject:s.params})),i=new F(t,r,s.body!==void 0?s.body:null,{headers:a,context:s.context,params:f,reportProgress:s.reportProgress,responseType:s.responseType||"json",withCredentials:s.withCredentials,transferCache:s.transferCache})}let o=H(i).pipe(me(a=>this.handler.handle(a)));if(t instanceof F||s.observe==="events")return o;let c=o.pipe(ye(a=>a instanceof z));switch(s.observe||"body"){case"body":switch(i.responseType){case"arraybuffer":return c.pipe(L(a=>{if(a.body!==null&&!(a.body instanceof ArrayBuffer))throw new Error("Response is not an ArrayBuffer.");return a.body}));case"blob":return c.pipe(L(a=>{if(a.body!==null&&!(a.body instanceof Blob))throw new Error("Response is not a Blob.");return a.body}));case"text":return c.pipe(L(a=>{if(a.body!==null&&typeof a.body!="string")throw new Error("Response is not a string.");return a.body}));case"json":default:return c.pipe(L(a=>a.body))}case"response":return c;default:throw new Error(`Unreachable: unhandled observe type ${s.observe}}`)}}delete(t,r={}){return this.request("DELETE",t,r)}get(t,r={}){return this.request("GET",t,r)}head(t,r={}){return this.request("HEAD",t,r)}jsonp(t,r){return this.request("JSONP",t,{params:new N().append(r,"JSONP_CALLBACK"),observe:"body",responseType:"json"})}options(t,r={}){return this.request("OPTIONS",t,r)}patch(t,r,s={}){return this.request("PATCH",t,te(s,r))}post(t,r,s={}){return this.request("POST",t,te(s,r))}put(t,r,s={}){return this.request("PUT",t,te(s,r))}static{this.\u0275fac=function(r){return new(r||n)(I(_))}}static{this.\u0275prov=w({token:n,factory:n.\u0275fac})}}return n})(),et=/^\)\]\}',?\n/,tt="X-Request-URL";function je(n){if(n.url)return n.url;let e=tt.toLocaleLowerCase();return n.headers.get(e)}var se=(()=>{class n{constructor(){this.fetchImpl=y(oe,{optional:!0})?.fetch??((...t)=>globalThis.fetch(...t)),this.ngZone=y(Se)}handle(t){return new Q(r=>{let s=new AbortController;return this.doRequest(t,s.signal,r).then(ie,i=>r.error(new A({error:i}))),()=>s.abort()})}doRequest(t,r,s){return Z(this,null,function*(){let i=this.createRequestInit(t),o;try{let u=this.ngZone.runOutsideAngular(()=>this.fetchImpl(t.urlWithParams,d({signal:r},i)));nt(u),s.next({type:O.Sent}),o=yield u}catch(u){s.error(new A({error:u,status:u.status??0,statusText:u.statusText,url:t.urlWithParams,headers:u.headers}));return}let c=new b(o.headers),a=o.statusText,f=je(o)??t.urlWithParams,g=o.status,m=null;if(t.reportProgress&&s.next(new W({headers:c,status:g,statusText:a,url:f})),o.body){let u=o.headers.get("content-length"),P=[],l=o.body.getReader(),h=0,S,x,p=typeof Zone<"u"&&Zone.current;yield this.ngZone.runOutsideAngular(()=>Z(this,null,function*(){for(;;){let{done:k,value:U}=yield l.read();if(k)break;if(P.push(U),h+=U.length,t.reportProgress){x=t.responseType==="text"?(x??"")+(S??=new TextDecoder).decode(U,{stream:!0}):void 0;let ue=()=>s.next({type:O.DownloadProgress,total:u?+u:void 0,loaded:h,partialText:x});p?p.run(ue):ue()}}}));let j=this.concatChunks(P,h);try{let k=o.headers.get("Content-Type")??"";m=this.parseBody(t,j,k)}catch(k){s.error(new A({error:k,headers:new b(o.headers),status:o.status,statusText:o.statusText,url:je(o)??t.urlWithParams}));return}}g===0&&(g=m?_e:0),g>=200&&g<300?(s.next(new z({body:m,headers:c,status:g,statusText:a,url:f})),s.complete()):s.error(new A({error:m,headers:c,status:g,statusText:a,url:f}))})}parseBody(t,r,s){switch(t.responseType){case"json":let i=new TextDecoder().decode(r).replace(et,"");return i===""?null:JSON.parse(i);case"text":return new TextDecoder().decode(r);case"blob":return new Blob([r],{type:s});case"arraybuffer":return r.buffer}}createRequestInit(t){let r={},s=t.withCredentials?"include":void 0;if(t.headers.forEach((i,o)=>r[i]=o.join(",")),t.headers.has("Accept")||(r.Accept="application/json, text/plain, */*"),!t.headers.has("Content-Type")){let i=t.detectContentTypeHeader();i!==null&&(r["Content-Type"]=i)}return{body:t.serializeBody(),method:t.method,headers:r,credentials:s}}concatChunks(t,r){let s=new Uint8Array(r),i=0;for(let o of t)s.set(o,i),i+=o.length;return s}static{this.\u0275fac=function(r){return new(r||n)}}static{this.\u0275prov=w({token:n,factory:n.\u0275fac})}}return n})(),oe=class{};function ie(){}function nt(n){n.then(ie,ie)}function rt(n,e){return e(n)}function st(n,e,t){return(r,s)=>be(t,()=>e(r,i=>n(i,s)))}var le=new M(""),ot=new M(""),it=new M("",{providedIn:"root",factory:()=>!0});var Ue=(()=>{class n extends _{constructor(t,r){super(),this.backend=t,this.injector=r,this.chain=null,this.pendingTasks=y(Pe),this.contributeToStability=y(it)}handle(t){if(this.chain===null){let r=Array.from(new Set([...this.injector.get(le),...this.injector.get(ot,[])]));this.chain=r.reduceRight((s,i)=>st(s,i,this.injector),rt)}if(this.contributeToStability){let r=this.pendingTasks.add();return this.chain(t,s=>this.backend.handle(s)).pipe(Te(()=>this.pendingTasks.remove(r)))}else return this.chain(t,r=>this.backend.handle(r))}static{this.\u0275fac=function(r){return new(r||n)(I(C),I(Ee))}}static{this.\u0275prov=w({token:n,factory:n.\u0275fac})}}return n})();var at=/^\)\]\}',?\n/;function ct(n){return"responseURL"in n&&n.responseURL?n.responseURL:/^X-Request-URL:/m.test(n.getAllResponseHeaders())?n.getResponseHeader("X-Request-URL"):null}var Fe=(()=>{class n{constructor(t){this.xhrFactory=t}handle(t){if(t.method==="JSONP")throw new ve(-2800,!1);let r=this.xhrFactory;return(r.\u0275loadImpl?ge(r.\u0275loadImpl()):H(null)).pipe(X(()=>new Q(i=>{let o=r.build();if(o.open(t.method,t.urlWithParams),t.withCredentials&&(o.withCredentials=!0),t.headers.forEach((l,h)=>o.setRequestHeader(l,h.join(","))),t.headers.has("Accept")||o.setRequestHeader("Accept","application/json, text/plain, */*"),!t.headers.has("Content-Type")){let l=t.detectContentTypeHeader();l!==null&&o.setRequestHeader("Content-Type",l)}if(t.responseType){let l=t.responseType.toLowerCase();o.responseType=l!=="json"?l:"text"}let c=t.serializeBody(),a=null,f=()=>{if(a!==null)return a;let l=o.statusText||"OK",h=new b(o.getAllResponseHeaders()),S=ct(o)||t.url;return a=new W({headers:h,status:o.status,statusText:l,url:S}),a},g=()=>{let{headers:l,status:h,statusText:S,url:x}=f(),p=null;h!==He&&(p=typeof o.response>"u"?o.responseText:o.response),h===0&&(h=p?_e:0);let j=h>=200&&h<300;if(t.responseType==="json"&&typeof p=="string"){let k=p;p=p.replace(at,"");try{p=p!==""?JSON.parse(p):null}catch(U){p=k,j&&(j=!1,p={error:U,text:p})}}j?(i.next(new z({body:p,headers:l,status:h,statusText:S,url:x||void 0})),i.complete()):i.error(new A({error:p,headers:l,status:h,statusText:S,url:x||void 0}))},m=l=>{let{url:h}=f(),S=new A({error:l,status:o.status||0,statusText:o.statusText||"Unknown Error",url:h||void 0});i.error(S)},E=!1,u=l=>{E||(i.next(f()),E=!0);let h={type:O.DownloadProgress,loaded:l.loaded};l.lengthComputable&&(h.total=l.total),t.responseType==="text"&&o.responseText&&(h.partialText=o.responseText),i.next(h)},P=l=>{let h={type:O.UploadProgress,loaded:l.loaded};l.lengthComputable&&(h.total=l.total),i.next(h)};return o.addEventListener("load",g),o.addEventListener("error",m),o.addEventListener("timeout",m),o.addEventListener("abort",m),t.reportProgress&&(o.addEventListener("progress",u),c!==null&&o.upload&&o.upload.addEventListener("progress",P)),o.send(c),i.next({type:O.Sent}),()=>{o.removeEventListener("error",m),o.removeEventListener("abort",m),o.removeEventListener("load",g),o.removeEventListener("timeout",m),t.reportProgress&&(o.removeEventListener("progress",u),c!==null&&o.upload&&o.upload.removeEventListener("progress",P)),o.readyState!==o.DONE&&o.abort()}})))}static{this.\u0275fac=function(r){return new(r||n)(I(ke))}}static{this.\u0275prov=w({token:n,factory:n.\u0275fac})}}return n})(),Ce=new M(""),lt="XSRF-TOKEN",dt=new M("",{providedIn:"root",factory:()=>lt}),ht="X-XSRF-TOKEN",ut=new M("",{providedIn:"root",factory:()=>ht}),G=class{},ft=(()=>{class n{constructor(t,r,s){this.doc=t,this.platform=r,this.cookieName=s,this.lastCookieString="",this.lastToken=null,this.parseCount=0}getToken(){if(this.platform==="server")return null;let t=this.doc.cookie||"";return t!==this.lastCookieString&&(this.parseCount++,this.lastToken=Oe(t,this.cookieName),this.lastCookieString=t),this.lastToken}static{this.\u0275fac=function(r){return new(r||n)(I(K),I(Ie),I(dt))}}static{this.\u0275prov=w({token:n,factory:n.\u0275fac})}}return n})();function pt(n,e){let t=n.url.toLowerCase();if(!y(Ce)||n.method==="GET"||n.method==="HEAD"||t.startsWith("http://")||t.startsWith("https://"))return e(n);let r=y(G).getToken(),s=y(ut);return r!=null&&!n.headers.has(s)&&(n=n.clone({headers:n.headers.set(s,r)})),e(n)}var de=function(n){return n[n.Interceptors=0]="Interceptors",n[n.LegacyInterceptors=1]="LegacyInterceptors",n[n.CustomXsrfConfiguration=2]="CustomXsrfConfiguration",n[n.NoXsrfProtection=3]="NoXsrfProtection",n[n.JsonpSupport=4]="JsonpSupport",n[n.RequestsMadeViaParent=5]="RequestsMadeViaParent",n[n.Fetch=6]="Fetch",n}(de||{});function Be(n,e){return{\u0275kind:n,\u0275providers:e}}function Xt(...n){let e=[ce,Fe,Ue,{provide:_,useExisting:Ue},{provide:C,useFactory:()=>y(se,{optional:!0})??y(Fe)},{provide:le,useValue:pt,multi:!0},{provide:Ce,useValue:!0},{provide:G,useClass:ft}];for(let t of n)e.push(...t.\u0275providers);return we(e)}function Jt(n){return Be(de.Interceptors,n.map(e=>({provide:le,useValue:e,multi:!0})))}function Vt(){return Be(de.Fetch,[se,{provide:C,useExisting:se}])}var ze={BASE_URL:"",SPEECH_TOKEN:"speech/token",CHAT:"chatbot/chat/website",AVATAR:"avatar",LOCALS:"http://localhost:3333",VIDEO_INDEXER:"https://www.videoindexer.ai/embed",AI_SEARCH:"search/search"};var q=class n{urls=ze;URLS={};config;static hasTrailingSlash(e){return(e+"").indexOf("/")===(e+"").length-1}static hasPrefixSlash(e){return(e+"").indexOf("/")===0}static removeTrailingSlash(e){return n.hasTrailingSlash(e)?(e+"").substring(0,(e+"").length-1):e}static removePrefixSlash(e){return n.hasPrefixSlash(e)?n.removePrefixSlash((e+"").substring(1,(e+"").length)):e}prepareUrls(){this.URLS.BASE_URL=n.removeTrailingSlash(this.config.BASE_URL);for(let e in this.urls)e!=="BASE_URL"&&Object.prototype.hasOwnProperty.call(this.urls,e)&&(this.URLS[e]=this.addBaseUrl(this.urls[e]));return this.URLS}addBaseUrl(e){return(this.config.CONFIG.EXTERNAL_PROTOCOLS??[]).some(r=>e.toLowerCase().indexOf(r)===0)?e:this.URLS.BASE_URL+"/"+n.removePrefixSlash(e)}setConfigService(e){this.config=e}static \u0275fac=function(t){return new(t||n)};static \u0275prov=w({token:n,factory:n.\u0275fac,providedIn:"root"})};var Xe=class n{http=y(ce);urlService=y(q);locals={};currentLanguage="ar";localChange=V(this.currentLanguage);langChange$=new pe(this.currentLanguage);document=y(K);localFile="resources/locals.json";constructor(){this.listenToLanguageChange()}load(){return this.http.get(this.localFile).pipe(J(e=>this.localization=e)).pipe(J(()=>this.prepareCurrentLocal()))}prepareCurrentLocal(){Object.keys(this.localization).forEach(e=>{this.locals[e]=this.localization[e][this.currentLanguage]}),this.locals=new Proxy(this.locals,{get(e,t){return e[t]?e[t]:`[MISSING KEY]: ${t}`}})}changeLanguage(e){this.currentLanguage=e,this.prepareCurrentLocal(),this.langChange$.next(e)}toggleLanguage(){this.changeLanguage(this.currentLanguage==="ar"?"en":"ar")}listenToLanguageChange(){this.langChange$.subscribe(e=>{console.log({lang:e}),this.document.dir=e==="ar"?"rtl":"ltr";let t=this.document.querySelector("html");t&&(t.lang=e),this.localChange.set(e)})}createLocal(e){return this.http.post(this.urlService.URLS.LOCALS,e).pipe(X(t=>this.load().pipe(L(()=>t))))}static \u0275fac=function(t){return new(t||n)};static \u0275prov=w({token:n,factory:n.\u0275fac,providedIn:"root"})};var gt=new WeakMap,v=Symbol("STATE_SOURCE");function R(n,...e){n[v].update(t=>e.reduce((r,s)=>d(d({},r),typeof s=="function"?s(r):s),t)),mt(n)}function Y(n){return n[v]()}function yt(n){return gt.get(n[v][fe])||[]}function mt(n){let e=yt(n);for(let t of e){let r=ee(()=>Y(n));t(r)}}function Je(n){let e=ee(()=>n());return Tt(e)?new Proxy(n,{get(t,r){return r in e?(Ae(t[r])||Object.defineProperty(t,r,{value:T(()=>t()[r]),configurable:!0}),Je(t[r])):t[r]}}):n}function Tt(n){return n?.constructor===Object}function Ve(...n){let e=[...n],t=typeof e[0]=="function"?{}:e.shift(),r=e;return(()=>{class i{constructor(){let c=r.reduce((l,h)=>h(l),vt()),{stateSignals:a,computedSignals:f,methods:g,hooks:m}=c,E=d(d(d({},a),f),g);this[v]=t.protectedState===!1?c[v]:c[v].asReadonly();for(let l in E)this[l]=E[l];let{onInit:u,onDestroy:P}=m;u&&u(),P&&y(Re).onDestroy(P)}static \u0275fac=function(a){return new(a||i)};static \u0275prov=w({token:i,factory:i.\u0275fac,providedIn:t.providedIn||null})}return i})()}function vt(){return{[v]:V({}),stateSignals:{},computedSignals:{},methods:{},hooks:{}}}function Ke(n){return e=>{let t=n(d(d({},e.stateSignals),e.computedSignals));return Object.keys(t),D(d({},e),{computedSignals:d(d({},e.computedSignals),t)})}}function $e(n){return e=>{let t=d(d(d({[v]:e[v]},e.stateSignals),e.computedSignals),e.methods),r=typeof n=="function"?n(t):n,s=i=>{let o=r[i],c=e.hooks[i];return o?()=>{c&&c(),o(t)}:c};return D(d({},e),{hooks:{onInit:s("onInit"),onDestroy:s("onDestroy")}})}}function he(n){return e=>{let t=n(d(d(d({[v]:e[v]},e.stateSignals),e.computedSignals),e.methods));return Object.keys(t),D(d({},e),{methods:d(d({},e.methods),t)})}}function We(n){return e=>{let t=typeof n=="function"?n():n,r=Object.keys(t);e[v].update(i=>d(d({},i),t));let s=r.reduce((i,o)=>{let c=T(()=>e[v]()[o]);return D(d({},i),{[o]:Je(c)})},{});return D(d({},e),{stateSignals:d(d({},e.stateSignals),s)})}}var wt={speechToken:{token:"",region:""},streamId:"",recording:"Stopped",streamingStatus:"Stopped",streamReady:!1,backgroundColor:"#8A1538",backgroundUrl:"assets/images/background.svg",logoUrl:"assets/images/qrep-newlogo-colored.png",isVideo:!1,preview:!1,videoToken:""},gn=Ve({providedIn:"root",protectedState:!0},We(wt),Ke(({streamId:n,speechToken:e,recording:t,streamingStatus:r})=>({hasToken:T(()=>!!e().token),hasRegion:T(()=>!!e().region),isRecordingStarted:T(()=>t()==="Started"),isRecordingStopped:T(()=>t()==="Stopped"),isRecordingLoading:T(()=>t()==="InProgress"),hasStream:T(()=>!!n()),isStreamStarted:T(()=>r()==="Started"),isStreamStopped:T(()=>r()==="Stopped"),isStreamLoading:T(()=>r()==="InProgress"||r()==="Disconnecting")})),he(n=>({updateSpeechToken:(e={token:"",region:""})=>{R(n,{speechToken:e})},updateStreamId:e=>{R(n,{streamId:e})},recordingStarted:()=>{R(n,{recording:"Started"})},recordingStopped:()=>{R(n,{recording:"Stopped"})},recordingInProgress:()=>{R(n,{recording:"InProgress"})},updateStreamStatus:(e="Stopped")=>{R(n,{streamingStatus:e})}})),he(n=>({updateState(e){R(n,e)}})),$e(n=>{let e=localStorage.getItem("CURRENT_STATE");if(e)R(n,JSON.parse(e));else{let t=Y(n);localStorage.setItem("CURRENT_STATE",JSON.stringify(t))}return{onInit(){Ne(()=>{let t=Y(n);localStorage.setItem("CURRENT_STATE",JSON.stringify(t))})}}}));export{ce as a,Xt as b,Jt as c,Vt as d,q as e,Xe as f,Y as g,gn as h};