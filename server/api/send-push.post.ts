// server/api/send-push.post.ts
import { H3Event } from 'h3'
import webpush from 'web-push'
import { getAllSubscriptions } from './save-subscription.post'

// 環境変数から読み込み
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || ''
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || ''
const VAPID_MAILTO = process.env.VAPID_MAILTO || 'mailto:example@example.com'

// VAPIDキーを設定
webpush.setVapidDetails(
  VAPID_MAILTO,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
)

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  // body = { title, message, url }
  const title = body.title || 'Hello from Nuxt3!'
  const message = body.message || 'This is a push notification.'
  const url = body.url || '/'

  // 送信するpayload (SWのpushイベントで data として取得される)
  const payload = JSON.stringify({
    title,
    body: message,
    url,
  })

  const subscriptions = getAllSubscriptions()
  let successCount = 0
  let failCount = 0

  // すべての購読先に通知を送信
  await Promise.all(subscriptions.map(async (sub) => {
    try {
      await webpush.sendNotification(sub, payload)
      successCount++
    } catch (err) {
      failCount++
      console.error('Push送信エラー:', err)
      // エラーによっては購読が無効になっている場合があるので、削除処理など検討
    }
  }))

  return {
    success: true,
    delivered: successCount,
    failed: failCount,
    total: subscriptions.length,
  }
})