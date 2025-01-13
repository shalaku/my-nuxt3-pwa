// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      // ここで process.env.VAPID_PUBLIC_KEY を参照し、クライアント側からも読み取れるようにする
      VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
    },
  },
  // Nuxt 3でサーバ機能(Nitro)を有効利用するために特に追加設定は不要ですが、
  // PWAモジュールを導入するために以下のモジュールを指定します。
  modules: [
    '@vite-pwa/nuxt',
  ],
  // PWA設定
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'My Nuxt3 PWA',
      short_name: 'Nuxt3PWA',
      description: 'Sample PWA for iOS 16.4+ push notifications',
      lang: 'ja',
      display: 'standalone',
      start_url: '/',
    },
    // Service Worker のカスタムソースを読み込む設定
    srcDir: 'service-worker',
    filename: 'custom-sw.ts', // 実際は .ts / .js どちらでもOK
    workbox: {
      // オフライン戦略やキャッシュ戦略を細かく指定可能
    },
    devOptions: {
      enabled: true, // 開発中にSWを有効にしたい場合
    },
  },
})