<script setup lang="ts">
import { useElementBounding, useEventListener, useWindowSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChatAvatar from '~/components/chat-avatar.vue'
import Button from '~/components/button.vue'
import Bubble from '~/components/bubble-in-chat.vue'
import { useCable } from '~/stores/cable'
import { useGlobalDialog } from '~/stores/global-dialogs'
import { useUser } from '~/stores/user'
import type { Received } from '~/types/chat'

const cable = useCable()
const route = useRoute()
const router = useRouter()
const { user } = storeToRefs(useUser())
const globalDialogs = useGlobalDialog()
const rejected = ref(true) // chat channel subscription rejected by server
const messages = ref<Received.NormalChatMessage[]>([])
const message = ref('')
const chatInfo = ref<Received.ChatInfo>()
const { height, width } = useWindowSize()
const scale = computed(() => width.value < 1200 ? width.value / 1286 : height.value / 1080)
const otherSide = computed(() => chatInfo.value?.from.address === user.value?.address ? chatInfo.value?.to : chatInfo.value?.from)
const self = computed(() => chatInfo.value?.from.address === user.value?.address ? chatInfo.value?.from : chatInfo.value?.to)
const chatContainer = ref<HTMLDivElement>()
const chatBubbles = ref<HTMLDivElement>()
const { scrollbarTop, startScroll, stopScroll, chatBubblesTop } = (() => {
  const scrollbarTop = ref(0)
  const { height: chatContainerHeight } = useElementBounding(chatContainer)
  const { height: chatBubblesHeight } = useElementBounding(chatBubbles)
  const chatBubblesTop = computed(() => {
    const value = scrollbarTop.value / -14 * (chatBubblesHeight.value - chatContainerHeight.value) / scale.value
    return value
  })
  let request = 0

  function scroll(up: boolean) {
    scrollbarTop.value += up ? -0.05 : 0.05
    if (up && scrollbarTop.value < 0)
      scrollbarTop.value = 0
    if (!up && scrollbarTop.value > 14)
      scrollbarTop.value = 14
  }

  function scrolling(up: boolean) {
    scroll(up)
    request = requestAnimationFrame(() => scrolling(up))
  }

  function startScroll(up: boolean) {
    scrolling(up)
  }

  function stopScroll() {
    cancelAnimationFrame(request)
  }

  useEventListener('wheel', (e: WheelEvent) => {
    scroll(e.deltaY < 0)
  })

  return {
    scrollbarTop,
    startScroll,
    stopScroll,
    chatBubblesTop,
  }
})()

function onMessageReceive(msg: Received.ChatMessage) {
  rejected.value = false
  switch (msg.type) {
    case 'exit':
      // TODO: show rating dialog
      break
    case 'normal':
      messages.value.push(msg)
      break
    case 'info':
      chatInfo.value = msg
      messages.value = chatInfo.value.messages
      break
  }
}

function onSubscriptionReject() {
  globalDialogs.showAlert(`You can't enter this chat, possible reason: <br/>
  1. This chat does not exists.<br/>
  2. This chat has been ended.<br/>
  3. You are not in this chat.
  `, 'Error', () => {
    router.push('/match')
  }, true)
}

function setupConnection() {
  cable.enterChat(Number.parseInt(route.params.id as string), user.value!.address, onMessageReceive, onSubscriptionReject)
}

function close() {
  cable.exitChat(user.value!.address)
}

watch([user], ([newUser]) => {
  if (!newUser)
    return

  setupConnection()
})

onMounted(() => {
  if (!user.value)
    return
  setupConnection()
})
</script>

<template>
  <div class="bg-chat absolute left-0 top-0 h-full w-full" />
  <div v-if="user" class="absolute left-0 top-0 h-full w-full flex flex-col">
    <!-- header -->
    <div class="w-full flex justify-center">
      <div class="max-w-1200px w-full flex justify-between p-5">
        <!-- back -->
        <div
          class="w-33 flex cursor-pointer items-center justify-center b-2px b-[rgba(255,255,255,0.25)] transition-colors hover:bg-[rgba(255,255,255,0.25)]"
          @click="router.push('/')"
        >
          <img srcset="../../assets/img/icon_exit_1x.png 1x, ../../assets/img/icon_exit_2x.png 2x" height="24">
          <div class="mr-4 flex items-center text-5 font-bold font-neue-bit text-white">
            Home
          </div>
        </div>
        <!-- info -->
        <div
          class="flex cursor-pointer items-center justify-center gap-x-2 b-2px b-[rgba(255,255,255,0.25)] px-3.5 transition-colors hover:bg-[rgba(255,255,255,0.25)]"
        >
          <img :src="user.avatar" height="24" width="24" class="rounded-5px">
          <img srcset="../../assets/img/lucky_1x.png 1x, ../../assets/img/lucky_2x.png 2x" height="24">
          <div class="flex items-center text-5 font-bold font-neue-bit text-white">
            :&nbsp;&nbsp;3343
          </div>
          <div class="h-5 w-2px bg-[rgba(255,255,255,0.25)]" />
          <div class="flex items-center text-5 font-bold font-neue-bit text-white">
            Rank&nbsp;&nbsp;:&nbsp;&nbsp;23
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Chat window -->
  <div v-if="!rejected && chatInfo && user" class="pointer-events-none absolute left-0 top-0 h-full w-full flex items-center justify-center">
    <div
      class="pointer-events-auto h-193 w-321.5 flex-shrink-0 border-0.5rem border-b-#808080 border-l-#e6e6e6 border-r-#808080 border-t-#e6e6e6 bg-#ccc"
      :style="{ transform: `scale(${scale})` }"
    >
      <div
        v-if="otherSide"
        class="absolute left-5 top-4 flex items-center"
      >
        <img srcset="../../assets/img/icon_heart_message.svg" height="24">
        <div class="ml-4 text-8 font-bold leading-6 font-neue-bit">
          Chat with "{{ otherSide.nickname }}"
        </div>
      </div>
      <!-- chat content -->
      <div v-if="otherSide" class="absolute right-94 top-13.5 h-110 w-218 flex border-0.25rem border-b-#ccc border-l-black border-r-#ccc border-t-black bg-#383838 outline-2px outline-black outline-solid">
        <div ref="chatContainer" class="absolute top-16 h-92 w-full overflow-hidden">
          <div ref="chatBubbles" class="absolute w-full pb-4 pr-8" :style="{ top: `${chatBubblesTop}px` }">
            <div class="mb-10 w-full flex justify-center">
              <div class="w-95 text-center text-6 font-bold leading-6 font-neue-bit text-#b5b5b5">
                By the power of Mercurius, you are successfully matched with {{ otherSide.nickname }}
              </div>
            </div>
            <div
              v-for="msg in messages"
              :key="msg.message"
              class="mt-6 w-full flex px-4"
              :class="{ 'justify-end': msg.from === user.address }"
            >
              <Bubble
                :left-to-right="msg.from === otherSide.address"
                :message="msg.message"
                :avatar="msg.from === otherSide.address ? otherSide.avatar : user.avatar"
              />
            </div>
            <div v-if="chatInfo.end_by" class="w-full text-center text-6 font-bold leading-6 font-neue-bit text-#b5b5b5">
              {{ `${chatInfo.end_by === user.address ? 'You' : otherSide.nickname} leaved this chat` }}
            </div>
          </div>
        </div>
        <!-- scrollbar -->
        <div class="absolute right-0 h-full flex b-b-6px b-r-6px border-b-#383838 border-r-#666">
          <div class="h-full w-0.5 bg-#383838" />
          <div class="h-full w-0.5 bg-#ddd" />
          <div class="h-full w-4 bg-#f2f2f2" />
          <div class="h-full w-0.5 bg-#ddd" />
          <img
            class="absolute h-38 w-5.5" :style="{
              top: `${1.5 + scrollbarTop}rem`,
            }" src="../../assets/img/scrollbar.svg"
          >
          <img
            class="absolute top-0 h-5.5 w-5.5 cursor-pointer" src="../../assets/img/icon_scrollbar_up.svg"
            @mousedown="startScroll(true)"
            @mouseup="stopScroll"
          >
          <img
            class="absolute bottom-0 h-5.5 w-5.5 cursor-pointer" src="../../assets/img/icon_scrollbar_down.svg"
            @mousedown="startScroll(false)"
            @mouseup="stopScroll"
          >
        </div>
      </div>
      <div class="pointer-events-none absolute right-94 w-218 flex justify-center -top-8">
        <img srcset="../../assets/img/icon_chat_header_border_1x.png 1x, ../../assets/img/icon_chat_header_border_2x.png 2x" width="148" height="120">
      </div>
      <textarea
        v-model="message"
        class="absolute bottom-24 right-94 h-34.5 w-218 border-0.25rem border-b-#ccc border-l-black border-r-#ccc border-t-black px-4 pt-2 text-8 font-bold leading-8 font-neue-bit outline-2px outline-black outline-solid selection:bg-black selection:text-white focus:outline-2px focus:outline-black"
        :placeholder="chatInfo.end ? 'This chat has been ended, but please click the close button to give us response of chat experience.' : 'Your message'"
        :disabled="chatInfo.end"
      />
      <Button
        class="absolute bottom-7 right-94 h-13 w-36.5 outline-1px outline-black outline-solid"
        :class="{ 'pointer-events-none': chatInfo.end }"
        @click="cable.sendToChat(message, user.address);message = ''"
      >
        <div class="h-full w-full text-center text-8 leading-5.5">
          Send
        </div>
      </Button>
      <div class="close-btn absolute right-5 top-5 h-6 w-6 cursor-pointer" @click="close" />
      <div v-if="otherSide && self" class="absolute right-16.5 top-13.5">
        <ChatAvatar :avatar="otherSide.avatar" :name="otherSide.nickname" />
        <ChatAvatar :avatar="self.avatar" :name="self.nickname" class="mt-18" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.bg-chat {
  background-color: black;
  background-image: url(../../assets/img/bg_chat.gif);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
