if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return c[e]||(r=new Promise(async r=>{if("document"in self){const c=document.createElement("script");c.src=e,document.head.appendChild(c),c.onload=r}else importScripts(e),r()})),r.then(()=>{if(!c[e])throw new Error(`Module ${e} didn’t register its module`);return c[e]})},r=(r,c)=>{Promise.all(r.map(e)).then(e=>c(1===e.length?e[0]:e))},c={require:Promise.resolve(r)};self.define=(r,i,a)=>{c[r]||(c[r]=Promise.resolve().then(()=>{let c={};const s={uri:location.origin+r.slice(1)};return Promise.all(i.map(r=>{switch(r){case"exports":return c;case"module":return s;default:return e(r)}})).then(e=>{const r=a(...e);return c.default||(c.default=r),c})}))}}define("./service-worker.js",["./workbox-d9851aed"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/./index.html",revision:"6e71a7cac7d0b926c81a6a6d9a1caa60"},{url:"/./player.html",revision:"8c5c0961ce94f0a39c1e49cc970b233c"},{url:"/3a8ca398e6a5c3b83f4de7c60843a9a0.png",revision:"3a8ca398e6a5c3b83f4de7c60843a9a0"},{url:"/editor.css?456c6c00bdfe80b9a085",revision:"460bc16fbb0e5620a5f8de30a9596e3d"},{url:"/editor.js?c2cc55d5e65ab655e476",revision:"d50c2400085361277ae6b46e6d06d6f3"},{url:"/icon.png",revision:"3a8ca398e6a5c3b83f4de7c60843a9a0"},{url:"/player.css?456c6c00bdfe80b9a085",revision:"460bc16fbb0e5620a5f8de30a9596e3d"},{url:"/player.js?3c7b2b297535cc486f44",revision:"bf646b5c690afc5493bd4abc2741e1ac"}],{})}));
