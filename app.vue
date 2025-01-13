<!-- app.vue -->
<template>
  <div>
    <!-- 全ページ共通ヘッダー -->
    <header>My Global Header</header>

    <!-- ページコンポーネントを表示する場所 -->
    <NuxtPage />

    <!-- 全ページ共通フッター -->
    <footer>My Global Footer</footer>
  </div>
</template>

<script setup lang="ts">
// 何も特別な処理をしないなら空でもOK
</script>