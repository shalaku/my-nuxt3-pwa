// server/api/save-subscription.post.ts
import { H3Event } from 'h3'

// メモリ上に保存するだけのデモ
const subscriptions: any[] = []

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  // body = { endpoint, keys: { auth, p256dh }, ... }

  // DBやファイルに保存するのが本来の実装
  subscriptions.push(body)

  return { success: true, storedCount: subscriptions.length }
})

// exportした変数等で他のAPIから取得できるようにする
export function getAllSubscriptions() {
  return subscriptions
}