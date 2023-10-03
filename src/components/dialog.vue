<script setup lang="ts">
withDefaults(defineProps<{
  title: string
}>(), {
  title: '',
})

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="absolute left-0 top-0 h-full w-full flex items-center justify-center bg-black/20">
    <div class="border-0.5rem border-b-#808080 border-l-#e6e6e6 border-r-#808080 border-t-#e6e6e6 bg-#ccc p-5 pt-0px">
      <!-- head -->
      <div class="h-13 flex items-end justify-end pb-12px">
        <div class="h-full flex flex-1 items-start justify-center text-9 font-bold font-neue-bit text-black">
          {{ title }}
        </div>
        <div class="close-btn h-6 w-6 cursor-pointer" @click="emit('close')" />
      </div>
      <!-- body -->
      <div class="bg-black p-5">
        <slot />
      </div>
    </div>
  </div>
</template>
