<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ChatRequestDialogProps } from '../types/ui'
import Button from './button.vue'
import Dialog from './dialog.vue'
import ChatAvatar from './chat-avatar.vue'

const props = defineProps<{
  info: ChatRequestDialogProps
}>()

const emit = defineEmits<{
  (e: 'accept' | 'request' | 'reject' | 'close'): void
}>()

const expired = ref(false)
onMounted(() => {
  // only outcome request will start countdown
  if (props.info.type === 'outcome' && !props.info.sent)
    setTimeout(() => expired.value = true, 1000 * 60 * 5)
})
</script>

<template>
  <Dialog :hide-close-btn="!info.example" @close="emit('close')">
    <div class="h-110 w-203 flex pl-4">
      <ChatAvatar :avatar="info.avatar" :name="info.name" class="mt-17.25 flex-shrink-0" />
      <div class="flex flex-col">
        <img
          srcset="../assets/img/icon_chat_header_1x.png 1x, ../assets/img/icon_chat_header_2x.png 2x"
          class="relative ml-10 -top-27" width="148" height="120"
        >
        <div class="ml-12 flex-1 text-10.5 font-bold leading-10.5 font-neue-bit text-white selection:bg-white selection:text-black">
          {{ info.message }}
        </div>
        <div v-if="info.error" class="ml-12 text-10.5 font-normal leading-10.5 font-neue-bit text-red selection:bg-white selection:text-black">
          {{ info.error }}
        </div>
        <div v-if="expired" class="ml-12 text-10.5 font-normal leading-10.5 font-neue-bit text-red selection:bg-white selection:text-black">
          This request was expired.
        </div>
        <div v-if="info.sent && !expired && !info.error" class="ml-12 text-10.5 font-bold leading-10.5 font-neue-bit text-white selection:bg-white selection:text-black">
          Waiting for request to be accepted...
        </div>
        <div class="mb-18 ml-12 flex gap-12">
          <Button v-if="!expired && !info.error && !info.sent" class="w-44.5 text-8 leading-8" @click="info.type === 'outcome' ? emit('request') : emit('accept')">
            <div class="flex items-center justify-center">
              <img class="h-6 w-6 object-contain" src="../assets/img/icon_heart_message.svg">
              <div class="ml-1.5">
                Chat
              </div>
            </div>
          </Button>
          <Button v-if="!info.error && info.type === 'incoming'" class="w-44.5 text-8 leading-8" @click="emit('reject')">
            <div class="flex items-center justify-center">
              <img class="h-6 w-6 object-contain" src="../assets/img/icon_cancel.svg">
              <div class="ml-1.5">
                Cancel
              </div>
            </div>
          </Button>
          <Button v-if="info.error || expired" class="w-44.5 text-8 leading-8" @click="emit('close')">
            <div class="flex items-center justify-center">
              <img class="h-6 w-6 object-contain" src="../assets/img/icon_cancel.svg">
              <div class="ml-1.5">
                Cancel
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  </Dialog>
</template>
