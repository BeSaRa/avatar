import{b as G}from"./chunk-ZWR4GBNY.js";import{a as V,e as q}from"./chunk-QSVBHP5J.js";import{Ga as _,H as j,J as M,La as K,a as D,ea as U,ib as F,ka as S,qa as N,sb as $,t as I,x as B}from"./chunk-NMJA3KYW.js";function w(t){return getComputedStyle(t)}function y(t,e){for(var r in e){var n=e[r];typeof n=="number"&&(n=n+"px"),t.style[r]=n}return t}function A(t){var e=document.createElement("div");return e.className=t,e}var J=typeof Element<"u"&&(Element.prototype.matches||Element.prototype.webkitMatchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector);function Y(t,e){if(!J)throw new Error("No element matching method supported");return J.call(t,e)}function R(t){t.remove?t.remove():t.parentNode&&t.parentNode.removeChild(t)}function Q(t,e){return Array.prototype.filter.call(t.children,function(r){return Y(r,e)})}var g={main:"ps",rtl:"ps__rtl",element:{thumb:function(t){return"ps__thumb-"+t},rail:function(t){return"ps__rail-"+t},consuming:"ps__child--consume"},state:{focus:"ps--focus",clicking:"ps--clicking",active:function(t){return"ps--active-"+t},scrolling:function(t){return"ps--scrolling-"+t}}},tt={x:null,y:null};function et(t,e){var r=t.element.classList,n=g.state.scrolling(e);r.contains(n)?clearTimeout(tt[e]):r.add(n)}function rt(t,e){tt[e]=setTimeout(function(){return t.isAlive&&t.element.classList.remove(g.state.scrolling(e))},t.settings.scrollingThreshold)}function ct(t,e){et(t,e),rt(t,e)}var C=function(e){this.element=e,this.handlers={}},nt={isEmpty:{configurable:!0}};C.prototype.bind=function(e,r){typeof this.handlers[e]>"u"&&(this.handlers[e]=[]),this.handlers[e].push(r),this.element.addEventListener(e,r,!1)};C.prototype.unbind=function(e,r){var n=this;this.handlers[e]=this.handlers[e].filter(function(a){return r&&a!==r?!0:(n.element.removeEventListener(e,a,!1),!1)})};C.prototype.unbindAll=function(){for(var e in this.handlers)this.unbind(e)};nt.isEmpty.get=function(){var t=this;return Object.keys(this.handlers).every(function(e){return t.handlers[e].length===0})};Object.defineProperties(C.prototype,nt);var X=function(){this.eventElements=[]};X.prototype.eventElement=function(e){var r=this.eventElements.filter(function(n){return n.element===e})[0];return r||(r=new C(e),this.eventElements.push(r)),r};X.prototype.bind=function(e,r,n){this.eventElement(e).bind(r,n)};X.prototype.unbind=function(e,r,n){var a=this.eventElement(e);a.unbind(r,n),a.isEmpty&&this.eventElements.splice(this.eventElements.indexOf(a),1)};X.prototype.unbindAll=function(){this.eventElements.forEach(function(e){return e.unbindAll()}),this.eventElements=[]};X.prototype.once=function(e,r,n){var a=this.eventElement(e),u=function(s){a.unbind(r,u),n(s)};a.bind(r,u)};function O(t){if(typeof window.CustomEvent=="function")return new CustomEvent(t);var e=document.createEvent("CustomEvent");return e.initCustomEvent(t,!1,!1,void 0),e}function k(t,e,r,n,a){n===void 0&&(n=!0),a===void 0&&(a=!1);var u;if(e==="top")u=["contentHeight","containerHeight","scrollTop","y","up","down"];else if(e==="left")u=["contentWidth","containerWidth","scrollLeft","x","left","right"];else throw new Error("A proper axis should be provided");ut(t,r,u,n,a)}function ut(t,e,r,n,a){var u=r[0],s=r[1],i=r[2],o=r[3],c=r[4],p=r[5];n===void 0&&(n=!0),a===void 0&&(a=!1);var l=t.element;t.reach[o]=null,l[i]<1&&(t.reach[o]="start"),l[i]>t[u]-t[s]-1&&(t.reach[o]="end"),e&&(l.dispatchEvent(O("ps-scroll-"+o)),e<0?l.dispatchEvent(O("ps-scroll-"+c)):e>0&&l.dispatchEvent(O("ps-scroll-"+p)),n&&ct(t,o)),t.reach[o]&&(e||a)&&l.dispatchEvent(O("ps-"+o+"-reach-"+t.reach[o]))}function d(t){return parseInt(t,10)||0}function ht(t){return Y(t,"input,[contenteditable]")||Y(t,"select,[contenteditable]")||Y(t,"textarea,[contenteditable]")||Y(t,"button,[contenteditable]")}function ft(t){var e=w(t);return d(e.width)+d(e.paddingLeft)+d(e.paddingRight)+d(e.borderLeftWidth)+d(e.borderRightWidth)}var E={isWebKit:typeof document<"u"&&"WebkitAppearance"in document.documentElement.style,supportsTouch:typeof window<"u"&&("ontouchstart"in window||"maxTouchPoints"in window.navigator&&window.navigator.maxTouchPoints>0||window.DocumentTouch&&document instanceof window.DocumentTouch),supportsIePointer:typeof navigator<"u"&&navigator.msMaxTouchPoints,isChrome:typeof navigator<"u"&&/Chrome/i.test(navigator&&navigator.userAgent)};function L(t){var e=t.element,r=Math.floor(e.scrollTop),n=e.getBoundingClientRect();t.containerWidth=Math.floor(n.width),t.containerHeight=Math.floor(n.height),t.contentWidth=e.scrollWidth,t.contentHeight=e.scrollHeight,e.contains(t.scrollbarXRail)||(Q(e,g.element.rail("x")).forEach(function(a){return R(a)}),e.appendChild(t.scrollbarXRail)),e.contains(t.scrollbarYRail)||(Q(e,g.element.rail("y")).forEach(function(a){return R(a)}),e.appendChild(t.scrollbarYRail)),!t.settings.suppressScrollX&&t.containerWidth+t.settings.scrollXMarginOffset<t.contentWidth?(t.scrollbarXActive=!0,t.railXWidth=t.containerWidth-t.railXMarginWidth,t.railXRatio=t.containerWidth/t.railXWidth,t.scrollbarXWidth=Z(t,d(t.railXWidth*t.containerWidth/t.contentWidth)),t.scrollbarXLeft=d((t.negativeScrollAdjustment+e.scrollLeft)*(t.railXWidth-t.scrollbarXWidth)/(t.contentWidth-t.containerWidth))):t.scrollbarXActive=!1,!t.settings.suppressScrollY&&t.containerHeight+t.settings.scrollYMarginOffset<t.contentHeight?(t.scrollbarYActive=!0,t.railYHeight=t.containerHeight-t.railYMarginHeight,t.railYRatio=t.containerHeight/t.railYHeight,t.scrollbarYHeight=Z(t,d(t.railYHeight*t.containerHeight/t.contentHeight)),t.scrollbarYTop=d(r*(t.railYHeight-t.scrollbarYHeight)/(t.contentHeight-t.containerHeight))):t.scrollbarYActive=!1,t.scrollbarXLeft>=t.railXWidth-t.scrollbarXWidth&&(t.scrollbarXLeft=t.railXWidth-t.scrollbarXWidth),t.scrollbarYTop>=t.railYHeight-t.scrollbarYHeight&&(t.scrollbarYTop=t.railYHeight-t.scrollbarYHeight),dt(e,t),t.scrollbarXActive?e.classList.add(g.state.active("x")):(e.classList.remove(g.state.active("x")),t.scrollbarXWidth=0,t.scrollbarXLeft=0,e.scrollLeft=t.isRtl===!0?t.contentWidth:0),t.scrollbarYActive?e.classList.add(g.state.active("y")):(e.classList.remove(g.state.active("y")),t.scrollbarYHeight=0,t.scrollbarYTop=0,e.scrollTop=0)}function Z(t,e){return t.settings.minScrollbarLength&&(e=Math.max(e,t.settings.minScrollbarLength)),t.settings.maxScrollbarLength&&(e=Math.min(e,t.settings.maxScrollbarLength)),e}function dt(t,e){var r={width:e.railXWidth},n=Math.floor(t.scrollTop);e.isRtl?r.left=e.negativeScrollAdjustment+t.scrollLeft+e.containerWidth-e.contentWidth:r.left=t.scrollLeft,e.isScrollbarXUsingBottom?r.bottom=e.scrollbarXBottom-n:r.top=e.scrollbarXTop+n,y(e.scrollbarXRail,r);var a={top:n,height:e.railYHeight};e.isScrollbarYUsingRight?e.isRtl?a.right=e.contentWidth-(e.negativeScrollAdjustment+t.scrollLeft)-e.scrollbarYRight-e.scrollbarYOuterWidth-9:a.right=e.scrollbarYRight-t.scrollLeft:e.isRtl?a.left=e.negativeScrollAdjustment+t.scrollLeft+e.containerWidth*2-e.contentWidth-e.scrollbarYLeft-e.scrollbarYOuterWidth:a.left=e.scrollbarYLeft+t.scrollLeft,y(e.scrollbarYRail,a),y(e.scrollbarX,{left:e.scrollbarXLeft,width:e.scrollbarXWidth-e.railBorderXWidth}),y(e.scrollbarY,{top:e.scrollbarYTop,height:e.scrollbarYHeight-e.railBorderYWidth})}function pt(t){t.event.bind(t.scrollbarY,"mousedown",function(e){return e.stopPropagation()}),t.event.bind(t.scrollbarYRail,"mousedown",function(e){var r=e.pageY-window.pageYOffset-t.scrollbarYRail.getBoundingClientRect().top,n=r>t.scrollbarYTop?1:-1;t.element.scrollTop+=n*t.containerHeight,L(t),e.stopPropagation()}),t.event.bind(t.scrollbarX,"mousedown",function(e){return e.stopPropagation()}),t.event.bind(t.scrollbarXRail,"mousedown",function(e){var r=e.pageX-window.pageXOffset-t.scrollbarXRail.getBoundingClientRect().left,n=r>t.scrollbarXLeft?1:-1;t.element.scrollLeft+=n*t.containerWidth,L(t),e.stopPropagation()})}var P=null;function gt(t){z(t,["containerHeight","contentHeight","pageY","railYHeight","scrollbarY","scrollbarYHeight","scrollTop","y","scrollbarYRail"]),z(t,["containerWidth","contentWidth","pageX","railXWidth","scrollbarX","scrollbarXWidth","scrollLeft","x","scrollbarXRail"])}function z(t,e){var r=e[0],n=e[1],a=e[2],u=e[3],s=e[4],i=e[5],o=e[6],c=e[7],p=e[8],l=t.element,f=null,m=null,h=null;function b(v){v.touches&&v.touches[0]&&(v[a]=v.touches[0]["page"+c.toUpperCase()]),P===s&&(l[o]=f+h*(v[a]-m),et(t,c),L(t),v.stopPropagation(),v.preventDefault())}function T(){rt(t,c),t[p].classList.remove(g.state.clicking),document.removeEventListener("mousemove",b),document.removeEventListener("mouseup",T),document.removeEventListener("touchmove",b),document.removeEventListener("touchend",T),P=null}function x(v){P===null&&(P=s,f=l[o],v.touches&&(v[a]=v.touches[0]["page"+c.toUpperCase()]),m=v[a],h=(t[n]-t[r])/(t[u]-t[i]),v.touches?(document.addEventListener("touchmove",b,{passive:!1}),document.addEventListener("touchend",T)):(document.addEventListener("mousemove",b),document.addEventListener("mouseup",T)),t[p].classList.add(g.state.clicking)),v.stopPropagation(),v.cancelable&&v.preventDefault()}t[s].addEventListener("mousedown",x),t[s].addEventListener("touchstart",x)}function mt(t){var e=t.element,r=function(){return Y(e,":hover")},n=function(){return Y(t.scrollbarX,":focus")||Y(t.scrollbarY,":focus")};function a(u,s){var i=Math.floor(e.scrollTop);if(u===0){if(!t.scrollbarYActive)return!1;if(i===0&&s>0||i>=t.contentHeight-t.containerHeight&&s<0)return!t.settings.wheelPropagation}var o=e.scrollLeft;if(s===0){if(!t.scrollbarXActive)return!1;if(o===0&&u<0||o>=t.contentWidth-t.containerWidth&&u>0)return!t.settings.wheelPropagation}return!0}t.event.bind(t.ownerDocument,"keydown",function(u){if(!(u.isDefaultPrevented&&u.isDefaultPrevented()||u.defaultPrevented)&&!(!r()&&!n())){var s=document.activeElement?document.activeElement:t.ownerDocument.activeElement;if(s){if(s.tagName==="IFRAME")s=s.contentDocument.activeElement;else for(;s.shadowRoot;)s=s.shadowRoot.activeElement;if(ht(s))return}var i=0,o=0;switch(u.which){case 37:u.metaKey?i=-t.contentWidth:u.altKey?i=-t.containerWidth:i=-30;break;case 38:u.metaKey?o=t.contentHeight:u.altKey?o=t.containerHeight:o=30;break;case 39:u.metaKey?i=t.contentWidth:u.altKey?i=t.containerWidth:i=30;break;case 40:u.metaKey?o=-t.contentHeight:u.altKey?o=-t.containerHeight:o=-30;break;case 32:u.shiftKey?o=t.containerHeight:o=-t.containerHeight;break;case 33:o=t.containerHeight;break;case 34:o=-t.containerHeight;break;case 36:o=t.contentHeight;break;case 35:o=-t.contentHeight;break;default:return}t.settings.suppressScrollX&&i!==0||t.settings.suppressScrollY&&o!==0||(e.scrollTop-=o,e.scrollLeft+=i,L(t),a(i,o)&&u.preventDefault())}})}function vt(t){var e=t.element;function r(s,i){var o=Math.floor(e.scrollTop),c=e.scrollTop===0,p=o+e.offsetHeight===e.scrollHeight,l=e.scrollLeft===0,f=e.scrollLeft+e.offsetWidth===e.scrollWidth,m;return Math.abs(i)>Math.abs(s)?m=c||p:m=l||f,m?!t.settings.wheelPropagation:!0}function n(s){var i=s.deltaX,o=-1*s.deltaY;return(typeof i>"u"||typeof o>"u")&&(i=-1*s.wheelDeltaX/6,o=s.wheelDeltaY/6),s.deltaMode&&s.deltaMode===1&&(i*=10,o*=10),i!==i&&o!==o&&(i=0,o=s.wheelDelta),s.shiftKey?[-o,-i]:[i,o]}function a(s,i,o){if(!E.isWebKit&&e.querySelector("select:focus"))return!0;if(!e.contains(s))return!1;for(var c=s;c&&c!==e;){if(c.classList.contains(g.element.consuming))return!0;var p=w(c);if(o&&p.overflowY.match(/(scroll|auto)/)){var l=c.scrollHeight-c.clientHeight;if(l>0&&(c.scrollTop>0&&o<0||c.scrollTop<l&&o>0))return!0}if(i&&p.overflowX.match(/(scroll|auto)/)){var f=c.scrollWidth-c.clientWidth;if(f>0&&(c.scrollLeft>0&&i<0||c.scrollLeft<f&&i>0))return!0}c=c.parentNode}return!1}function u(s){var i=n(s),o=i[0],c=i[1];if(!a(s.target,o,c)){var p=!1;t.settings.useBothWheelAxes?t.scrollbarYActive&&!t.scrollbarXActive?(c?e.scrollTop-=c*t.settings.wheelSpeed:e.scrollTop+=o*t.settings.wheelSpeed,p=!0):t.scrollbarXActive&&!t.scrollbarYActive&&(o?e.scrollLeft+=o*t.settings.wheelSpeed:e.scrollLeft-=c*t.settings.wheelSpeed,p=!0):(e.scrollTop-=c*t.settings.wheelSpeed,e.scrollLeft+=o*t.settings.wheelSpeed),L(t),p=p||r(o,c),p&&!s.ctrlKey&&(s.stopPropagation(),s.preventDefault())}}typeof window.onwheel<"u"?t.event.bind(e,"wheel",u):typeof window.onmousewheel<"u"&&t.event.bind(e,"mousewheel",u)}function bt(t){if(!E.supportsTouch&&!E.supportsIePointer)return;var e=t.element,r={startOffset:{},startTime:0,speed:{},easingLoop:null};function n(l,f){var m=Math.floor(e.scrollTop),h=e.scrollLeft,b=Math.abs(l),T=Math.abs(f);if(T>b){if(f<0&&m===t.contentHeight-t.containerHeight||f>0&&m===0)return window.scrollY===0&&f>0&&E.isChrome}else if(b>T&&(l<0&&h===t.contentWidth-t.containerWidth||l>0&&h===0))return!0;return!0}function a(l,f){e.scrollTop-=f,e.scrollLeft-=l,L(t)}function u(l){return l.targetTouches?l.targetTouches[0]:l}function s(l){return l.target===t.scrollbarX||l.target===t.scrollbarY||l.pointerType&&l.pointerType==="pen"&&l.buttons===0?!1:!!(l.targetTouches&&l.targetTouches.length===1||l.pointerType&&l.pointerType!=="mouse"&&l.pointerType!==l.MSPOINTER_TYPE_MOUSE)}function i(l){if(s(l)){var f=u(l);r.startOffset.pageX=f.pageX,r.startOffset.pageY=f.pageY,r.startTime=new Date().getTime(),r.easingLoop!==null&&clearInterval(r.easingLoop)}}function o(l,f,m){if(!e.contains(l))return!1;for(var h=l;h&&h!==e;){if(h.classList.contains(g.element.consuming))return!0;var b=w(h);if(m&&b.overflowY.match(/(scroll|auto)/)){var T=h.scrollHeight-h.clientHeight;if(T>0&&(h.scrollTop>0&&m<0||h.scrollTop<T&&m>0))return!0}if(f&&b.overflowX.match(/(scroll|auto)/)){var x=h.scrollWidth-h.clientWidth;if(x>0&&(h.scrollLeft>0&&f<0||h.scrollLeft<x&&f>0))return!0}h=h.parentNode}return!1}function c(l){if(s(l)){var f=u(l),m={pageX:f.pageX,pageY:f.pageY},h=m.pageX-r.startOffset.pageX,b=m.pageY-r.startOffset.pageY;if(o(l.target,h,b))return;a(h,b),r.startOffset=m;var T=new Date().getTime(),x=T-r.startTime;x>0&&(r.speed.x=h/x,r.speed.y=b/x,r.startTime=T),n(h,b)&&l.cancelable&&l.preventDefault()}}function p(){t.settings.swipeEasing&&(clearInterval(r.easingLoop),r.easingLoop=setInterval(function(){if(t.isInitialized){clearInterval(r.easingLoop);return}if(!r.speed.x&&!r.speed.y){clearInterval(r.easingLoop);return}if(Math.abs(r.speed.x)<.01&&Math.abs(r.speed.y)<.01){clearInterval(r.easingLoop);return}a(r.speed.x*30,r.speed.y*30),r.speed.x*=.8,r.speed.y*=.8},10))}E.supportsTouch?(t.event.bind(e,"touchstart",i),t.event.bind(e,"touchmove",c),t.event.bind(e,"touchend",p)):E.supportsIePointer&&(window.PointerEvent?(t.event.bind(e,"pointerdown",i),t.event.bind(e,"pointermove",c),t.event.bind(e,"pointerup",p)):window.MSPointerEvent&&(t.event.bind(e,"MSPointerDown",i),t.event.bind(e,"MSPointerMove",c),t.event.bind(e,"MSPointerUp",p)))}var yt=function(){return{handlers:["click-rail","drag-thumb","keyboard","wheel","touch"],maxScrollbarLength:null,minScrollbarLength:null,scrollingThreshold:1e3,scrollXMarginOffset:0,scrollYMarginOffset:0,suppressScrollX:!1,suppressScrollY:!1,swipeEasing:!0,useBothWheelAxes:!1,wheelPropagation:!0,wheelSpeed:1}},Tt={"click-rail":pt,"drag-thumb":gt,keyboard:mt,wheel:vt,touch:bt},H=function(e,r){var n=this;if(r===void 0&&(r={}),typeof e=="string"&&(e=document.querySelector(e)),!e||!e.nodeName)throw new Error("no element is specified to initialize PerfectScrollbar");this.element=e,e.classList.add(g.main),this.settings=yt();for(var a in r)this.settings[a]=r[a];this.containerWidth=null,this.containerHeight=null,this.contentWidth=null,this.contentHeight=null;var u=function(){return e.classList.add(g.state.focus)},s=function(){return e.classList.remove(g.state.focus)};this.isRtl=w(e).direction==="rtl",this.isRtl===!0&&e.classList.add(g.rtl),this.isNegativeScroll=function(){var c=e.scrollLeft,p=null;return e.scrollLeft=-1,p=e.scrollLeft<0,e.scrollLeft=c,p}(),this.negativeScrollAdjustment=this.isNegativeScroll?e.scrollWidth-e.clientWidth:0,this.event=new X,this.ownerDocument=e.ownerDocument||document,this.scrollbarXRail=A(g.element.rail("x")),e.appendChild(this.scrollbarXRail),this.scrollbarX=A(g.element.thumb("x")),this.scrollbarXRail.appendChild(this.scrollbarX),this.scrollbarX.setAttribute("tabindex",0),this.event.bind(this.scrollbarX,"focus",u),this.event.bind(this.scrollbarX,"blur",s),this.scrollbarXActive=null,this.scrollbarXWidth=null,this.scrollbarXLeft=null;var i=w(this.scrollbarXRail);this.scrollbarXBottom=parseInt(i.bottom,10),isNaN(this.scrollbarXBottom)?(this.isScrollbarXUsingBottom=!1,this.scrollbarXTop=d(i.top)):this.isScrollbarXUsingBottom=!0,this.railBorderXWidth=d(i.borderLeftWidth)+d(i.borderRightWidth),y(this.scrollbarXRail,{display:"block"}),this.railXMarginWidth=d(i.marginLeft)+d(i.marginRight),y(this.scrollbarXRail,{display:""}),this.railXWidth=null,this.railXRatio=null,this.scrollbarYRail=A(g.element.rail("y")),e.appendChild(this.scrollbarYRail),this.scrollbarY=A(g.element.thumb("y")),this.scrollbarYRail.appendChild(this.scrollbarY),this.scrollbarY.setAttribute("tabindex",0),this.event.bind(this.scrollbarY,"focus",u),this.event.bind(this.scrollbarY,"blur",s),this.scrollbarYActive=null,this.scrollbarYHeight=null,this.scrollbarYTop=null;var o=w(this.scrollbarYRail);this.scrollbarYRight=parseInt(o.right,10),isNaN(this.scrollbarYRight)?(this.isScrollbarYUsingRight=!1,this.scrollbarYLeft=d(o.left)):this.isScrollbarYUsingRight=!0,this.scrollbarYOuterWidth=this.isRtl?ft(this.scrollbarY):null,this.railBorderYWidth=d(o.borderTopWidth)+d(o.borderBottomWidth),y(this.scrollbarYRail,{display:"block"}),this.railYMarginHeight=d(o.marginTop)+d(o.marginBottom),y(this.scrollbarYRail,{display:""}),this.railYHeight=null,this.railYRatio=null,this.reach={x:e.scrollLeft<=0?"start":e.scrollLeft>=this.contentWidth-this.containerWidth?"end":null,y:e.scrollTop<=0?"start":e.scrollTop>=this.contentHeight-this.containerHeight?"end":null},this.isAlive=!0,this.settings.handlers.forEach(function(c){return Tt[c](n)}),this.lastScrollTop=Math.floor(e.scrollTop),this.lastScrollLeft=e.scrollLeft,this.event.bind(this.element,"scroll",function(c){return n.onScroll(c)}),L(this)};H.prototype.update=function(){this.isAlive&&(this.negativeScrollAdjustment=this.isNegativeScroll?this.element.scrollWidth-this.element.clientWidth:0,y(this.scrollbarXRail,{display:"block"}),y(this.scrollbarYRail,{display:"block"}),this.railXMarginWidth=d(w(this.scrollbarXRail).marginLeft)+d(w(this.scrollbarXRail).marginRight),this.railYMarginHeight=d(w(this.scrollbarYRail).marginTop)+d(w(this.scrollbarYRail).marginBottom),y(this.scrollbarXRail,{display:"none"}),y(this.scrollbarYRail,{display:"none"}),L(this),k(this,"top",0,!1,!0),k(this,"left",0,!1,!0),y(this.scrollbarXRail,{display:""}),y(this.scrollbarYRail,{display:""}))};H.prototype.onScroll=function(e){this.isAlive&&(L(this),k(this,"top",this.element.scrollTop-this.lastScrollTop),k(this,"left",this.element.scrollLeft-this.lastScrollLeft),this.lastScrollTop=Math.floor(this.element.scrollTop),this.lastScrollLeft=this.element.scrollLeft)};H.prototype.destroy=function(){this.isAlive&&(this.event.unbindAll(),R(this.scrollbarX),R(this.scrollbarY),R(this.scrollbarXRail),R(this.scrollbarYRail),this.removePsClasses(),this.element=null,this.scrollbarX=null,this.scrollbarY=null,this.scrollbarXRail=null,this.scrollbarYRail=null,this.isAlive=!1)};H.prototype.removePsClasses=function(){this.element.className=this.element.className.split(" ").filter(function(e){return!e.match(/^ps([-_].+|)$/)}).join(" ")};var Lt=H;function Wt(t=!1){return e=>e.pipe(M(r=>(t&&console.log(r),I("CUSTOM_ERROR")))).pipe(j(r=>r!=="CUSTOM_ERROR"))}function ot(){let t=new Date().getTime(),e=typeof performance<"u"&&performance.now&&performance.now()*1e3||0;return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(r){let n=Math.random()*16;return t>0?(n=(t+n)%16|0,t=Math.floor(t/16)):(n=(e+n)%16|0,e=Math.floor(e/16)),(r==="x"?n:n&3|8).toString(16)})}function wt(t){return/[\u0600-\u06FF]+/.test(t)}var lt=t=>(t.split(" ").map(e=>(wt(e)?"\u202A":"\u202C")+e).join(" "),t);function st(t){return class extends t{clone(r){let n=this.constructor;return Object.assign(new n,this,r)}}}var W=class extends st(class{}){constructor(r="",n="user"){super();this.content=r;this.role=n;this.id=ot()}context;end_turn;function_call;tool_calls;id;isUser(){return this.role==="user"}isAssistant(){return this.role==="assistant"}isError(){return this.role==="error"}};var it=class t{http=S(V);urlService=S(q);store=S(G);messages=$([]);sendMessage(e){return this.messages.update(r=>[...r,new W(e,"user")]),this.http.post(this.urlService.URLS.CHAT,D({messages:this.messages()},this.store.streamId()?{stream_id:this.store.streamId()}:null)).pipe(M(r=>{throw new W().clone({content:r.message,role:"error"}),new Error(r)})).pipe(B(r=>(r.message.content=lt(this.formatText(r.message.content)),r.message=new W().clone(r.message),this.messages.update(n=>[...n,r.message]),r)))}formatText(e){let r=e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>");return r=r.replace(/\[(.*?)\]/g,'<pre class="d-inline"><small class="px-1 text-primary">$1<i class="link-icon"></i></small></pre>'),r.trim()}static \u0275fac=function(r){return new(r||t)};static \u0275prov=U({token:t,factory:t.\u0275fac,providedIn:"root"})};var at=class t{constructor(e){this.elementRef=e}text="";speed=20;animating=new _;ngOnInit(){this.animateText()}animateText(){this.animating.emit(!0);let e=0,r="",n=()=>{r+=this.text.charAt(e),this.elementRef.nativeElement.innerHTML=r,e++,e<this.text.length?setTimeout(n,this.speed*Math.random()):this.animating.emit(!1)};n()}static \u0275fac=function(r){return new(r||t)(F(K))};static \u0275dir=N({type:t,selectors:[["","appTextWriterAnimator",""]],inputs:{text:"text",speed:"speed"},outputs:{animating:"animating"},standalone:!0})};export{Lt as a,Wt as b,it as c,at as d};
