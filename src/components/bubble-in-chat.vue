<script setup lang="ts">
defineProps<{
  message: string
  leftToRight: boolean
  avatar: string
}>()
</script>

<template>
  <div class="flex">
    <div
      v-if="leftToRight" class="mr-2 h-11 w-11 rounded-5px !bg-cover !bg-center !bg-no-repeat"
      :style="{ backgroundImage: `url(${avatar})`, backgroundColor: 'black' }"
    />
    <div
      class="flex"
    >
      <div v-if="leftToRight" class="relative left-1.75 top-4 box-border h-3 w-3 transform border-l-0.125rem border-t-0.125rem border-black bg-white -rotate-z-45deg" />
      <div
        class="bubble max-w-127.5 flex border-0.125rem border-black px-3 py-1.5 text-7 font-bold leading-7 font-neue-bit"
        :class="leftToRight ? 'bg-white text-black' : 'bg-#419ED1 text-white'"
      >
        <div :class="leftToRight ? 'selection:bg-black selection:text-white' : 'selection:bg-pink'">
          {{ message }}
        </div>
      </div>
      <div v-if="!leftToRight" class="relative top-4 box-border h-3 w-3 rotate-z-45deg transform border-r-0.125rem border-t-0.125rem border-black bg-#419ED1 -left-1.75" />
    </div>
    <div
      v-if="!leftToRight" class="ml-2 h-11 w-11 rounded-5px !bg-cover !bg-center !bg-no-repeat"
      :style="{ backgroundImage: `url(${avatar})`, backgroundColor: 'black' }"
    />
  </div>
</template>

<style lang="less" scoped>
.bubble {
  box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.33);
}
</style>
