<script setup lang="ts">
</script>

<template>
  <div
    class="cursor-pointer select-none b-8px border-b-#666 border-r-#666 bg-white p-0.5 p-1 font-bold font-neue-bit active:border-b-white active:border-l-#666 active:border-r-white active:border-t-#666 active:!bg-#f2f2f2"
  >
    <div class="b-1 b-black border-dashed bg-#f2f2f2 p-1">
      <slot />
    </div>
  </div>
</template>
