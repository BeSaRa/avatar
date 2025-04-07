import{a as n}from"./chunk-LW5BK7FI.js";import{a as y}from"./chunk-E3E2MV6E.js";import"./chunk-JBQTXQGX.js";import{d as C}from"./chunk-PUOFABER.js";import"./chunk-V7ZCYTZO.js";import"./chunk-LX6LIX5A.js";import"./chunk-3MSRG7IT.js";import"./chunk-PCRSGRUG.js";import"./chunk-ZPRGCDHT.js";import"./chunk-DNPOOQKF.js";import"./chunk-5PTZG25G.js";import"./chunk-L4GXIFO4.js";import"./chunk-WK44F4QQ.js";import"./chunk-OK5S6IU3.js";import"./chunk-SLIRYUJ2.js";import{b as x}from"./chunk-UR3XF2OI.js";import"./chunk-7UCX2ERW.js";import{Bc as s,Cc as r,Dc as v,Ja as d,Ka as h,Nc as f,cc as t,dc as a,ec as A,lc as u,sb as o,ta as p,xa as g}from"./chunk-OUJ2UPQI.js";var l=class e{lang=p(x);chatService=p(y);toggleChat(){this.chatService.status.update(c=>!c)}static \u0275fac=function(m){return new(m||e)};static \u0275cmp=g({type:e,selectors:[["app-landing"]],standalone:!0,features:[f],decls:26,vars:7,consts:[[1,"flex","flex-col"],[1,"text-3xl","text-center","mt-10"],[1,"flex","flex-col","md:flex-row","w-full","gap-4","mt-10"],[1,"border","rounded-md","overflow-hidden","flex","flex-auto","md:basis-0","flex-col"],[1,"text-primary","bg-gray-200","py-2","px-4","flex","justify-between","items-center"],["fill","currentColor","xmlns","http://www.w3.org/2000/svg","viewBox","0 0 24 24",1,"size-6"],["d","M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"],[1,"p-4","flex","flex-col","gap-4","flex-auto"],[1,"flex-auto"],[1,"bg-gray-200","p-2","rounded-md","text-primary","hover:bg-gray-300","active:bg-gray-400","mt-auto",3,"click"],["xmlns","http://www.w3.org/2000/svg","fill","currentColor","viewBox","0 0 256 256",1,"size-6"],["d","M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"],["routerLink","search",1,"bg-gray-200","p-2","rounded-md","text-primary","hover:bg-gray-300","active:bg-gray-400","mt-auto"]],template:function(m,i){m&1&&(t(0,"div",0)(1,"h1",1),s(2),a(),t(3,"div",2)(4,"div",3)(5,"div",4)(6,"h1"),s(7),a(),d(),t(8,"svg",5),A(9,"path",6),a()(),h(),t(10,"div",7)(11,"p",8),s(12),a(),t(13,"button",9),u("click",function(){return i.toggleChat()}),s(14),a()()(),t(15,"div",3)(16,"div",4)(17,"h1"),s(18),a(),d(),t(19,"svg",10),A(20,"path",11),a()(),h(),t(21,"div",7)(22,"p",8),s(23),a(),t(24,"button",12),s(25),a()()()()()),m&2&&(o(2),r(i.lang.locals.welcome_message),o(5),r(i.lang.locals.chat),o(5),r(i.lang.locals.chat_description),o(2),v(" ",i.lang.locals.try_it_out," "),o(4),r(i.lang.locals.search),o(5),r(i.lang.locals.document_search_description),o(2),v(" ",i.lang.locals.try_it_out," "))},dependencies:[C]})};var P=[{path:"",component:l},{path:"video-indexer",loadComponent:()=>import("./chunk-HMVNWH6V.js").then(e=>e.VideoIndexerComponent),canActivate:[n.canActivate],data:{permissions:["MEDIA"],hasAnyPermission:!1}},{path:"search",loadComponent:()=>import("./chunk-ELKK3B54.js").then(e=>e.AiSearchComponent),canActivate:[n.canActivate],data:{permissions:["SEARCH"],hasAnyPermission:!1}},{path:"chat-history",loadComponent:()=>import("./chunk-VGQBZQML.js").then(e=>e.ChatHistoryComponent),canActivate:[n.canActivate],data:{permissions:["CHATBOT"],hasAnyPermission:!1}},{path:"doc-intelligence",loadComponent:()=>import("./chunk-CUUL5WJJ.js").then(e=>e.DocumentIntelligenceComponent),canActivate:[n.canActivate],data:{permissions:["DOCUMENT_INTELLIGENCE"],hasAnyPermission:!1}},{path:"interactive-chatbot",loadComponent:()=>import("./chunk-QETSIMJO.js").then(e=>e.InteractiveChatComponent),canActivate:[n.canActivate],data:{permissions:["CHATBOT"],hasAnyPermission:!1}},{path:"tasks-agent",loadComponent:()=>import("./chunk-BGWGJSQU.js").then(e=>e.AgentChatComponent),canActivate:[n.canActivate],data:{permissions:["CHATBOT"],hasAnyPermission:!1}},{path:"web-crawler",loadComponent:()=>import("./chunk-EJ5DUJ4N.js").then(e=>e.WebCrawlerReportComponent),canActivate:[n.canActivate],data:{permissions:["SEARCH"],hasAnyPermission:!1}},{path:"statistics",loadComponent:()=>import("./chunk-PLFBDWXE.js").then(e=>e.StatisticsComponent),canActivate:[n.canActivate],data:{permissions:["ADMIN"],hasAnyPermission:!1}},{path:"admin",loadChildren:()=>import("./chunk-ETDLJMNU.js"),canActivate:[n.canActivate],data:{permissions:["ADMIN"],hasAnyPermission:!0}},{path:"video_analyzer",loadComponent:()=>import("./chunk-MX6ALROP.js").then(e=>e.VideoAnalyzerComponent)},{path:"**",redirectTo:""}],L=P;export{L as default};
