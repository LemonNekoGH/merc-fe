<script setup lang="ts">
import Button from '../button.vue'
import Dialog from '../dialog.vue'
import ChatAvatar from '../chat-avatar.vue'
import { useCable } from '~/stores/cable'
import type { Common } from '~/types/chat'

defineProps<{
  message: Common.HallMessage
  id: number
  example?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const cable = useCable()
</script>

<template>
  <Dialog :hide-close-btn="!example" @close="emit('close')">
    <div class="h-110 w-203 flex pl-4">
      <ChatAvatar v-if="message.from" :avatar="message.from.avatar" :name="message.from.nickname" class="mt-17.25 flex-shrink-0" />
      <div class="flex flex-col">
        <img
          srcset="../../assets/img/icon_chat_header_1x.png 1x, ../../assets/img/icon_chat_header_2x.png 2x"
          class="relative ml-10 -top-27" width="148" height="120"
        >
        <div class="ml-12 flex-1 text-10.5 font-bold leading-10.5 font-neue-bit text-white selection:bg-white selection:text-black">
          {{ message.message }}
        </div>
        <div class="mb-18 ml-12 flex gap-12">
          <Button class="w-44.5 text-8 leading-8" @click="cable.acceptChatRequest(id);emit('close')">
            <div class="flex items-center justify-center">
              <img class="h-6 w-6 object-contain" src="../../assets/img/icon_heart_message.svg">
              <div class="ml-1.5">
                Chat
              </div>
            </div>
          </Button>
          <Button class="w-44.5 text-8 leading-8" @click="cable.rejectChatRequest(id);emit('close')">
            <div class="flex items-center justify-center">
              <img class="h-6 w-6 object-contain" src="../../assets/img/icon_cancel.svg">
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
