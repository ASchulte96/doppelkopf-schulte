const CACHE='dk-v1';

self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});

// Nachricht vom Hauptthread: Spieltag-Erinnerung planen
self.addEventListener('message',e=>{
  if(e.data?.type==='PLAN_REMINDER'){
    const {ms, title, body} = e.data;
    if(ms > 0 && ms < 86400000){
      setTimeout(()=>{
        self.registration.showNotification(title,{
          body,
          icon:'https://aschulte96.github.io/doppelkopf-schulte/icon.png',
          badge:'https://aschulte96.github.io/doppelkopf-schulte/icon.png',
          tag:'spieltag',
          requireInteraction:true,
          vibrate:[200,100,200]
        });
      }, ms);
    }
  }
});

self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.openWindow('https://aschulte96.github.io/doppelkopf-schulte/'));
});
