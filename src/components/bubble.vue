<script setup lang="ts">
import heartOutline from '../assets/img/icon_heart_outline.svg'
import heartFull from '../assets/img/icon_heart_full.svg'
import type { HallMessage } from '~/types/chat/common'

defineProps<{
  message: HallMessage
  leftToRight: boolean
  like: boolean
}>()

const emit = defineEmits<{
  (e: 'avatarClicked' | 'bubbleClicked'): void
}>()
</script>

<template>
  <div class="flex">
    <div
      v-if="leftToRight" class="mr-2 h-11 w-11 cursor-pointer rounded-5px !bg-cover !bg-center !bg-no-repeat"
      :style="{ backgroundImage: `url(${message.from.avatar})` }"
      @click="emit('avatarClicked')"
    />
    <div
      class="flex cursor-pointer"
      @click="emit('bubbleClicked')"
    >
      <div v-if="leftToRight" class="relative left-1.75 top-4 box-border h-3 w-3 transform border-l-0.125rem border-t-0.125rem border-white bg-black -rotate-z-45deg" />
      <div
        class="max-w-127.5 flex border-0.125rem border-white bg-black px-3 py-1.5 text-7 font-bold leading-7 font-neue-bit text-white"
      >
        <div class="selection:bg-white selection:text-black">
          {{ message.message }}
        </div>
        <img :src="like ? heartFull : heartOutline" class="ml-2 mt-0.5 h-5 w-5 object-contain object-center">
      </div>
      <div v-if="!leftToRight" class="relative top-4 box-border h-3 w-3 rotate-z-45deg transform border-r-0.125rem border-t-0.125rem border-white bg-black -left-1.75" />
    </div>
    <div
      v-if="!leftToRight" class="ml-2 h-11 w-11 rounded-5px !bg-cover !bg-center !bg-no-repeat"
      :style="{ backgroundImage: `url(${message.from.avatar})` }"
      @click="emit('avatarClicked')"
    />
  </div>
</template>
