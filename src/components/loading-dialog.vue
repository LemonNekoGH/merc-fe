<script setup lang="ts">
import Dialog from './dialog.vue'
</script>

<template>
  <Dialog :hide-close-btn="true">
    <div class="w-40 flex p-2">
      <img src="../assets/img/icon_loading.svg" class="icon-loading mt-1.5 h-9">
      <div class="ml-6 text-9 font-bold font-neue-bit text-white">
        Loading...
      </div>
    </div>
  </Dialog>
</template>

<style scoped lang="less">
@keyframes icon-loading-rotating {
  0% {
    transform: rotateZ(0deg)
  }
  25%, 50% {
    transform: rotateZ(180deg);
  }
  75%, 100% {
    transform: rotateZ(360deg);
  }
}

.icon-loading {
  animation: icon-loading-rotating 2s infinite linear;
}
</style>
