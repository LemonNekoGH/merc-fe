<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Button from '../button.vue'
import Dialog from '../dialog.vue'
import ChatAvatar from '../chat-avatar.vue'
import { useCable } from '~/stores/cable'
import { useUser } from '~/stores/user'
import type { Common } from '~/types/chat'

const props = defineProps<{
  message: Common.HallMessage
  error: string
  id: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const cable = useCable()
const expired = ref(false)
const user = useUser()
const sent = computed(() => props.id !== -1)

function onChatButtonClick() {
  if (!user.user)
    return
  cable.requestChatFromHall(user.user.address, props.message.from.address, props.message.message)
}

onMounted(() => {
  // only outcome request will start countdown
  if (!sent.value)
    setTimeout(() => expired.value = true, 1000 * 60 * 5)
})
</script>

<template>
  <Dialog :hide-close-btn="sent" @close="emit('close')">
    <div class="h-110 w-203 flex pl-4">
      <ChatAvatar :avatar="message.from.avatar" :name="message.from.nickname" class="mt-17.25 flex-shrink-0" />
      <div class="flex flex-col">
        <img
          srcset="../../assets/img/icon_chat_header_1x.png 1x, ../../assets/img/icon_chat_header_2x.png 2x"
          class="relative ml-10 -top-27" width="148" height="120"
        >
        <div class="ml-12 flex-1 text-10.5 font-bold leading-10.5 font-neue-bit text-white selection:bg-white selection:text-black">
          {{ message.message }}
        </div>
        <div v-if="error" class="ml-12 text-10.5 font-normal leading-10.5 font-neue-bit text-red selection:bg-white selection:text-black">
          {{ error }}
        </div>
        <div v-if="expired" class="ml-12 text-10.5 font-normal leading-10.5 font-neue-bit text-red selection:bg-white selection:text-black">
          This request was expired.
        </div>
        <div v-if="sent && !expired && !error" class="ml-12 text-10.5 font-bold leading-10.5 font-neue-bit text-white selection:bg-white selection:text-black">
          Waiting for request to be accepted...
        </div>
        <div class="mb-18 ml-12 flex gap-12">
          <Button
            v-if="!expired && !error && !sent"
            class="w-44.5 text-8 leading-8"
            @click="onChatButtonClick"
          >
            <div class="flex items-center justify-center">
              <img class="h-6 w-6 object-contain" src="../../assets/img/icon_heart_message.svg">
              <div class="ml-1.5">
                Chat
              </div>
            </div>
          </Button>
          <Button v-if="error || expired || sent" class="w-44.5 text-8 leading-8" @click="sent ? cable.cancelChatRequest(id) : '';emit('close')">
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
