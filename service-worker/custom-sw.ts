// service-worker/custom-sw.ts
/// <reference lib="webworker" />

// プッシュ通知を受信した際の処理
self.addEventListener('push', (event: any) => {
    const data = event.data?.json() || {}
    const title = data.title || '通知タイトル'
    const options: NotificationOptions = {
      body: data.body || '通知内容',
      icon: '/pwa-192x192.png', // /public配下やmanifestのiconに合わせる
      badge: '/pwa-192x192.png',
      data: data.url || '/',
    }
  
    event.waitUntil(
      self.registration.showNotification(title, options)
    )
  })
  
// 通知をタップした際の処理
self.addEventListener('notificationclick', (event: any) => {
event.notification.close()
const urlToOpen = event.notification.data || '/'

event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then((windowClients: any) => {
        // 既存タブがあれば再利用し、なければ新規タブを開く
        const matchingClient = windowClients.find((client: any) => {
        return client.url.includes(urlToOpen)
        })
        if (matchingClient) {
        return matchingClient.focus()
        } else {
        return self.clients.openWindow(urlToOpen)
        }
    })
)
})