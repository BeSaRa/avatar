import{Cb as w,Db as j,Oa as v,a as o,b as g,gd as i,hd as m,id as A,j as T,na as b,ta as R}from"./chunk-5LB72LK3.js";var H=new WeakMap,s=Symbol("STATE_SOURCE");function d(e,...t){e[s].update(n=>t.reduce((r,S)=>o(o({},r),typeof S=="function"?S(r):S),n)),L(e)}function f(e){return e[s]()}function x(e){return H.get(e[s][T])||[]}function L(e){let t=x(e);for(let n of t){let r=m(()=>f(e));n(r)}}function C(e){let t=m(()=>e());return _(t)?new Proxy(e,{get(n,r){return r in t?(w(n[r])||Object.defineProperty(n,r,{value:i(()=>n()[r]),configurable:!0}),C(n[r])):n[r]}}):e}function _(e){return e?.constructor===Object}function D(...e){let t=[...e],n=typeof t[0]=="function"?{}:t.shift(),r=t;return(()=>{class c{constructor(){let a=r.reduce((p,W)=>W(p),J()),{stateSignals:l,computedSignals:U,methods:N,hooks:O}=a,k=o(o(o({},l),U),N);this[s]=n.protectedState===!1?a[s]:a[s].asReadonly();for(let p in k)this[p]=k[p];let{onInit:y,onDestroy:I}=O;y&&y(),I&&R(v).onDestroy(I)}static \u0275fac=function(l){return new(l||c)};static \u0275prov=b({token:c,factory:c.\u0275fac,providedIn:n.providedIn||null})}return c})()}function J(){return{[s]:j({}),stateSignals:{},computedSignals:{},methods:{},hooks:{}}}function E(e){return t=>{let n=e(o(o({},t.stateSignals),t.computedSignals));return Object.keys(n),g(o({},t),{computedSignals:o(o({},t.computedSignals),n)})}}function P(e){return t=>{let n=o(o(o({[s]:t[s]},t.stateSignals),t.computedSignals),t.methods),r=typeof e=="function"?e(n):e,S=c=>{let u=r[c],a=t.hooks[c];return u?()=>{a&&a(),u(n)}:a};return g(o({},t),{hooks:{onInit:S("onInit"),onDestroy:S("onDestroy")}})}}function h(e){return t=>{let n=e(o(o(o({[s]:t[s]},t.stateSignals),t.computedSignals),t.methods));return Object.keys(n),g(o({},t),{methods:o(o({},t.methods),n)})}}function M(e){return t=>{let n=typeof e=="function"?e():e,r=Object.keys(n);t[s].update(c=>o(o({},c),n));let S=r.reduce((c,u)=>{let a=i(()=>t[s]()[u]);return g(o({},c),{[u]:C(a)})},{});return g(o({},t),{stateSignals:o(o({},t.stateSignals),S)})}}var q={speechToken:{token:"",region:""},streamId:"",recording:"Stopped",streamingStatus:"Stopped",streamReady:!1,backgroundColor:"#8A1538",backgroundUrl:"assets/images/background.svg",logoUrl:"assets/images/qrep-newlogo-colored.png",isVideo:!1,preview:!1,videoToken:""},F=D({providedIn:"root",protectedState:!0},M(q),E(({streamId:e,speechToken:t,recording:n,streamingStatus:r})=>({hasToken:i(()=>!!t().token),hasRegion:i(()=>!!t().region),isRecordingStarted:i(()=>n()==="Started"),isRecordingStopped:i(()=>n()==="Stopped"),isRecordingLoading:i(()=>n()==="InProgress"),hasStream:i(()=>!!e()),isStreamStarted:i(()=>r()==="Started"),isStreamStopped:i(()=>r()==="Stopped"),isStreamLoading:i(()=>r()==="InProgress"||r()==="Disconnecting")})),h(e=>({updateSpeechToken:(t={token:"",region:""})=>{d(e,{speechToken:t})},updateStreamId:t=>{d(e,{streamId:t})},recordingStarted:()=>{d(e,{recording:"Started"})},recordingStopped:()=>{d(e,{recording:"Stopped"})},recordingInProgress:()=>{d(e,{recording:"InProgress"})},updateStreamStatus:(t="Stopped")=>{d(e,{streamingStatus:t})}})),h(e=>({updateState(t){d(e,t)}})),P(e=>{let t=localStorage.getItem("CURRENT_STATE");if(t)d(e,JSON.parse(t));else{let n=f(e);localStorage.setItem("CURRENT_STATE",JSON.stringify(n))}return{onInit(){e.isRecordingLoading()&&d(e,{recording:"Stopped"}),A(()=>{let n=f(e);localStorage.setItem("CURRENT_STATE",JSON.stringify(n))})}}}));export{f as a,F as b};
