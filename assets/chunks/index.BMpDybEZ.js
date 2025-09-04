import{L as m,p,q as S,v as h,Y as b}from"./framework.CCndWvNN.js";/*!
  * vue-router v4.5.1
  * (c) 2025 Eduardo San Martin Morote
  * @license MIT
  */var d;(function(e){e.pop="pop",e.push="push"})(d||(d={}));var u;(function(e){e.back="back",e.forward="forward",e.unknown=""})(u||(u={}));var l;(function(e){e[e.aborted=4]="aborted",e[e.cancelled=8]="cancelled",e[e.duplicated=16]="duplicated"})(l||(l={}));const v=Symbol("");function i(e){return m(v)}function w(e,a={}){const f=i(),t=p(e),r=`page_storage_${a.key||f.path}`,s=o=>{try{sessionStorage.setItem(r,JSON.stringify(o))}catch(g){console.error("Failed to save page storage:",g)}},n=()=>{try{const o=sessionStorage.getItem(r);if(!o)return;t.value=JSON.parse(o)}catch(o){console.error("Failed to load page storage:",o)}},c=()=>{sessionStorage.removeItem(r)};return S(()=>t.value,o=>{s(o)},{deep:!0}),h(()=>{a.immediate!==!1&&n()}),b(()=>{c()}),{data:t,clear:c,save:s,load:n}}export{w as usePageStorage};
