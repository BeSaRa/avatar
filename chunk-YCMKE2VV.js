import{Cb as C,Db as w,Oa as R,a as o,b as g,ed as r,fd as m,gd as j,j as b,na as T,ta as v}from"./chunk-2X7BKT3F.js";var H=new WeakMap,s=Symbol("STATE_SOURCE");function a(e,...t){e[s].update(n=>t.reduce((i,d)=>o(o({},i),typeof d=="function"?d(i):d),n)),L(e)}function p(e){return e[s]()}function x(e){return H.get(e[s][b])||[]}function L(e){let t=x(e);for(let n of t){let i=m(()=>p(e));n(i)}}function A(e){let t=m(()=>e());return _(t)?new Proxy(e,{get(n,i){return i in t?(C(n[i])||Object.defineProperty(n,i,{value:r(()=>n()[i]),configurable:!0}),A(n[i])):n[i]}}):e}function _(e){return e?.constructor===Object}function D(...e){let t=[...e],n=typeof t[0]=="function"?{}:t.shift(),i=t;return(()=>{class c{constructor(){let S=i.reduce((l,O)=>O(l),J()),{stateSignals:f,computedSignals:M,methods:U,hooks:N}=S,I=o(o(o({},f),M),U);this[s]=n.protectedState===!1?S[s]:S[s].asReadonly();for(let l in I)this[l]=I[l];let{onInit:k,onDestroy:y}=N;k&&k(),y&&v(R).onDestroy(y)}static \u0275fac=function(f){return new(f||c)};static \u0275prov=T({token:c,factory:c.\u0275fac,providedIn:n.providedIn||null})}return c})()}function J(){return{[s]:w({}),stateSignals:{},computedSignals:{},methods:{},hooks:{}}}function E(e){return t=>{let n=e(o(o({},t.stateSignals),t.computedSignals));return Object.keys(n),g(o({},t),{computedSignals:o(o({},t.computedSignals),n)})}}function W(e){return t=>{let n=o(o(o({[s]:t[s]},t.stateSignals),t.computedSignals),t.methods),i=typeof e=="function"?e(n):e,d=c=>{let u=i[c],S=t.hooks[c];return u?()=>{S&&S(),u(n)}:S};return g(o({},t),{hooks:{onInit:d("onInit"),onDestroy:d("onDestroy")}})}}function h(e){return t=>{let n=e(o(o(o({[s]:t[s]},t.stateSignals),t.computedSignals),t.methods));return Object.keys(n),g(o({},t),{methods:o(o({},t.methods),n)})}}function P(e){return t=>{let n=typeof e=="function"?e():e,i=Object.keys(n);t[s].update(c=>o(o({},c),n));let d=i.reduce((c,u)=>{let S=r(()=>t[s]()[u]);return g(o({},c),{[u]:A(S)})},{});return g(o({},t),{stateSignals:o(o({},t.stateSignals),d)})}}var q={speechToken:{token:"",region:""},streamId:"",recording:"Stopped",streamingStatus:"Stopped",streamReady:!1,backgroundColor:"#8A1538",backgroundUrl:"assets/images/background.svg",logoUrl:"assets/images/qrep-newlogo-colored.png",isVideo:!1,preview:!1,videoToken:"",isInteractiWithChat:!1},F=D({providedIn:"root",protectedState:!0},P(q),E(({streamId:e,speechToken:t,recording:n,streamingStatus:i,isInteractiWithChat:d})=>({hasToken:r(()=>!!t().token),hasRegion:r(()=>!!t().region),isRecordingStarted:r(()=>n()==="Started"),isRecordingStopped:r(()=>n()==="Stopped"),isRecordingLoading:r(()=>n()==="InProgress"),hasStream:r(()=>!!e()),isStreamStarted:r(()=>i()==="Started"),isStreamStopped:r(()=>i()==="Stopped"),isStreamLoading:r(()=>i()==="InProgress"||i()==="Disconnecting"),isInteracted:r(()=>!!d())})),h(e=>({updateSpeechToken:(t={token:"",region:""})=>{a(e,{speechToken:t})},updateStreamId:t=>{a(e,{streamId:t})},recordingStarted:()=>{a(e,{recording:"Started"})},recordingStopped:()=>{a(e,{recording:"Stopped"})},recordingInProgress:()=>{a(e,{recording:"InProgress"})},updateStreamStatus:(t="Stopped")=>{a(e,{streamingStatus:t})},updateInteractioinWithChat:t=>{a(e,{isInteractiWithChat:t})}})),h(e=>({updateState(t){a(e,t)}})),W(e=>{let t=localStorage.getItem("CURRENT_STATE");if(t)a(e,JSON.parse(t));else{let n=p(e);localStorage.setItem("CURRENT_STATE",JSON.stringify(n)),localStorage.removeItem("isInteractiWithChat")}return{onInit(){a(e,{isInteractiWithChat:!1}),e.isRecordingLoading()&&a(e,{recording:"Stopped"}),j(()=>{let n=p(e);localStorage.setItem("CURRENT_STATE",JSON.stringify(n))})}}}));export{p as a,F as b};
