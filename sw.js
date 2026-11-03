const CACHE="tugerentia-shell-v3";
const FILES=["./app.html","./index.html","./manifest.webmanifest","./icon-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("tugerentia-shell-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin)return;
  const isApp=u.pathname.endsWith("/index.html")||u.pathname.endsWith("/app.html")||u.pathname.endsWith("/TuGerentIA/")||u.pathname.endsWith("/TuGerentIA");
  if(isApp){
    e.respondWith(fetch(e.request).then(res=>{
      if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
      return res;
    }).catch(()=>caches.match(e.request).then(hit=>hit||caches.match("./app.html"))));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
    if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
    return res;
  }).catch(()=>caches.match("./app.html"))));
});