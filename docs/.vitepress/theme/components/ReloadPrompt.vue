<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

const needRefresh = ref(false);

let updateServiceWorker: (() => Promise<void>) | undefined;

function onNeedRefresh() {
  needRefresh.value = true;
}
async function close() {
  needRefresh.value = false;
}

onBeforeMount(async () => {
  const { registerSW } = await import("virtual:pwa-register");
  updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh,
  });
});
</script>

<template>
  <template v-if="needRefresh">
    <div
      class="pwa-toast z-100 bg-$vp-c-bg border border-$pwa-divider fixed right-0 bottom-0 m-6 px-6 py-4 rounded shadow-xl"
      role="alertdialog"
      aria-labelledby="pwa-message"
    >
      <div id="pwa-message" class="mb-3">
        发现新内容可用，点击“刷新”按钮来更新文档
      </div>
      <button
        type="button"
        class="pwa-refresh mr-2 px-3 py-1 rounded"
        @click="updateServiceWorker?.()"
      >
        刷新
      </button>
      <button
        type="button"
        class="pwa-cancel border border-$pwa-divider mr-2 px-3 py-1 rounded"
        @click="close"
      >
        取消
      </button>
    </div>
  </template>
</template>

<style>
.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 12px;
  border: 1px solid #8885;
  border-radius: 4px;
  z-index: 100;
  text-align: left;
  box-shadow: 3px 4px 5px 0 #8885;
}
.pwa-toast #pwa-message {
  margin-bottom: 8px;
}
.pwa-toast button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
}
</style>
