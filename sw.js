const FB_PUSH='https://doppelkopf-schulte-default-rtdb.europe-west1.firebasedatabase.app/push.json';
const ICON='https://aschulte96.github.io/doppelkopf-schulte/icon.png';

self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.openWindow('https://aschulte96.github.io/doppelkopf-schulte/'));
});

// Geplante lokale Erinnerung (bestehendes Feature)
self.addEventListener('message',e=>{
  if(e.data?.type==='PLAN_REMINDER'){
    const {ms,title,body}=e.data;
    if(ms>0&&ms<86400000){
      setTimeout(()=>{
        self.registration.showNotification(title,{
          body,icon:ICON,badge:ICON,tag:'spieltag',requireInteraction:true,vibrate:[200,100,200]
        });
      },ms);
    }
  }
});

// Periodic Background Sync: prüft Firebase ob Admin eine Erinnerung geschickt hat
self.addEventListener('periodicsync',e=>{
  if(e.tag==='dk-push-check')e.waitUntil(checkFbPush());
});

async function checkFbPush(){
  try{
    const r=await fetch(FB_PUSH);
    const n=await r.json();
    if(!n||!n.ts)return;
    const cache=await caches.open('dk-push-meta');
    const prev=await cache.match('last-ts');
    const lastTs=prev?+(await prev.text()):0;
    if(n.ts<=lastTs)return;
    await cache.put('last-ts',new Response(String(n.ts)));
    await self.registration.showNotification('DoppelKopf Schulte',{
      body:n.message,icon:ICON,badge:ICON,tag:'dk-remind',renotify:true
    });
  }catch(e){}
}
