import{Cc as i,Dc as m,Ea as R,Ec as A,a as o,b as g,ea as b,h as T,ka as v,rb as w,sb as j}from"./chunk-NMJA3KYW.js";var H=new WeakMap,s=Symbol("STATE_SOURCE");function S(e,...t){e[s].update(n=>t.reduce((r,d)=>o(o({},r),typeof d=="function"?d(r):d),n)),_(e)}function f(e){return e[s]()}function x(e){return H.get(e[s][T])||[]}function _(e){let t=x(e);for(let n of t){let r=m(()=>f(e));n(r)}}function C(e){let t=m(()=>e());return J(t)?new Proxy(e,{get(n,r){return r in t?(w(n[r])||Object.defineProperty(n,r,{value:i(()=>n()[r]),configurable:!0}),C(n[r])):n[r]}}):e}function J(e){return e?.constructor===Object}function D(...e){let t=[...e],n=typeof t[0]=="function"?{}:t.shift(),r=t;return(()=>{class c{constructor(){let a=r.reduce((p,W)=>W(p),L()),{stateSignals:l,computedSignals:U,methods:N,hooks:O}=a,k=o(o(o({},l),U),N);this[s]=n.protectedState===!1?a[s]:a[s].asReadonly();for(let p in k)this[p]=k[p];let{onInit:y,onDestroy:I}=O;y&&y(),I&&v(R).onDestroy(I)}static \u0275fac=function(l){return new(l||c)};static \u0275prov=b({token:c,factory:c.\u0275fac,providedIn:n.providedIn||null})}return c})()}function L(){return{[s]:j({}),stateSignals:{},computedSignals:{},methods:{},hooks:{}}}function E(e){return t=>{let n=e(o(o({},t.stateSignals),t.computedSignals));return Object.keys(n),g(o({},t),{computedSignals:o(o({},t.computedSignals),n)})}}function P(e){return t=>{let n=o(o(o({[s]:t[s]},t.stateSignals),t.computedSignals),t.methods),r=typeof e=="function"?e(n):e,d=c=>{let u=r[c],a=t.hooks[c];return u?()=>{a&&a(),u(n)}:a};return g(o({},t),{hooks:{onInit:d("onInit"),onDestroy:d("onDestroy")}})}}function h(e){return t=>{let n=e(o(o(o({[s]:t[s]},t.stateSignals),t.computedSignals),t.methods));return Object.keys(n),g(o({},t),{methods:o(o({},t.methods),n)})}}function M(e){return t=>{let n=typeof e=="function"?e():e,r=Object.keys(n);t[s].update(c=>o(o({},c),n));let d=r.reduce((c,u)=>{let a=i(()=>t[s]()[u]);return g(o({},c),{[u]:C(a)})},{});return g(o({},t),{stateSignals:o(o({},t.stateSignals),d)})}}var q={speechToken:{token:"",region:""},streamId:"",recording:"Stopped",streamingStatus:"Stopped",streamReady:!1,backgroundColor:"#8A1538",backgroundUrl:"assets/images/background.svg",logoUrl:"assets/images/qrep-newlogo-colored.png",isVideo:!1,preview:!1,videoToken:""},F=D({providedIn:"root",protectedState:!0},M(q),E(({streamId:e,speechToken:t,recording:n,streamingStatus:r})=>({hasToken:i(()=>!!t().token),hasRegion:i(()=>!!t().region),isRecordingStarted:i(()=>n()==="Started"),isRecordingStopped:i(()=>n()==="Stopped"),isRecordingLoading:i(()=>n()==="InProgress"),hasStream:i(()=>!!e()),isStreamStarted:i(()=>r()==="Started"),isStreamStopped:i(()=>r()==="Stopped"),isStreamLoading:i(()=>r()==="InProgress"||r()==="Disconnecting")})),h(e=>({updateSpeechToken:(t={token:"",region:""})=>{S(e,{speechToken:t})},updateStreamId:t=>{S(e,{streamId:t})},recordingStarted:()=>{S(e,{recording:"Started"})},recordingStopped:()=>{S(e,{recording:"Stopped"})},recordingInProgress:()=>{S(e,{recording:"InProgress"})},updateStreamStatus:(t="Stopped")=>{S(e,{streamingStatus:t})}})),h(e=>({updateState(t){S(e,t)}})),P(e=>{let t=localStorage.getItem("CURRENT_STATE");if(t)S(e,JSON.parse(t));else{let n=f(e);localStorage.setItem("CURRENT_STATE",JSON.stringify(n))}return{onInit(){A(()=>{let n=f(e);localStorage.setItem("CURRENT_STATE",JSON.stringify(n))})}}}));export{f as a,F as b};
