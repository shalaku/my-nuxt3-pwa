<!-- pages/index.vue -->
<template>
    <div style="padding: 2rem;">
      <h1>My Nuxt3 PWA</h1>
      <p>iOS 16.4+ のホーム画面に追加するとプッシュ通知が受け取れます。</p>
      <button @click="subscribePush">通知を許可</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRuntimeConfig } from '#app'
  
  // 通知購読
  async function subscribePush() {
    // 1. runtimeConfig から VAPID_PUBLIC_KEY を取得
    const config = useRuntimeConfig()
    const vapidPublicKey = config.public.VAPID_PUBLIC_KEY
    
    if (!vapidPublicKey) {
      alert('VAPID_PUBLIC_KEY が設定されていません。')
      return
    }
    
    // 2. 通知の権限をリクエスト
    // if (!('Notification' in window)) {
    //   alert('ブラウザが通知に対応していません。')
    //   return
    // }
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      alert('通知が許可されませんでした。')
      return
    }
  
    // 3. Service Worker が準備完了になるのを待つ
    const swReg = await navigator.serviceWorker.ready
  
    // 4. Push Subscription を作成 (購読開始)
    const subscription = await swReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    })
  
    // 5. サーバーAPIへ購読情報を送信し、保存してもらう
    const res = await fetch('/api/save-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    })
  
    if (res.ok) {
      alert('通知購読が完了しました！')
    } else {
      alert('購読情報の保存に失敗しました...')
    }
  }
  
  // VAPID公開鍵用 Base64URL => Uint8Array 変換関数
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
  }
  </script>