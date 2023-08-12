<script setup lang="ts">
import { onBeforeMount, ref } from "vue"

const needRefresh = ref(false)

let updateServiceWorker: (() => Promise<void>) | undefined

function onNeedRefresh() {
  needRefresh.value = true
}
async function close() {
  needRefresh.value = false
}

onBeforeMount(async () => {
  const { registerSW } = await import("virtual:pwa-register")
  updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh,
  })
})
</script>

<template>
  <template v-if="needRefresh">
    <div
      class="pwa-toast z-100 bg-$vp-c-bg border border-$pwa-divider fixed right-0 bottom-0 m-6 px-6 py-4 rounded shadow-xl"
      role="alertdialog"
      aria-labelledby="pwa-message">
      <div id="pwa-message" class="mb-3">
        发现新内容可用，点击“刷新”按钮来更新文档
      </div>
      <button
        type="button"
        class="pwa-refresh mr-2 px-3 py-1 rounded"
        @click="updateServiceWorker?.()">
        刷新
      </button>
      <button
        type="button"
        class="pwa-cancel border border-$pwa-divider mr-2 px-3 py-1 rounded"
        @click="close">
        取消
      </button>
    </div>
  </template>
</template>

<style>
.pwa-toast {
  --c-divider: var(--vp-c-divider-light);
}
.pwa-toast .pwa-refresh {
  border-color: var(--vp-button-brand-border);
  color: var(--vp-button-brand-text);
  background-color: var(--vp-button-brand-bg);
}
.pwa-toast .pwa-refresh:hover {
  border-color: var(--vp-button-brand-hover-border);
  color: var(--vp-button-brand-hover-text);
  background-color: var(--vp-button-brand-hover-bg);
}
.pwa-toast .pwa-refresh:active {
  border-color: var(--vp-button-brand-active-border);
  color: var(--vp-button-brand-active-text);
  background-color: var(--vp-button-brand-active-bg);
}
.pwa-toast .pwa-cancel {
  border-color: var(--vp-button-alt-border);
  color: var(--vp-button-alt-text);
  background-color: var(--vp-button-alt-bg);
}
.pwa-toast .pwa-cancel:hover {
  border-color: var(--vp-button-alt-hover-border);
  color: var(--vp-button-alt-hover-text);
  background-color: var(--vp-button-alt-hover-bg);
}
.pwa-toast .pwa-cancel:active {
  border-color: var(--vp-button-alt-active-border);
  color: var(--vp-button-alt-active-text);
  background-color: var(--vp-button-alt-active-bg);
}
.dark .pwa-toast {
  --pwa-divider: var(--vp-c-divider-dark-1);
}
</style>
