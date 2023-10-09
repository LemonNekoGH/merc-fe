<script setup lang="ts">
import { useIntervalFn, useWindowSize } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import Button from '../components/button.vue'
import { useUser } from '~/stores/user'
import { useGlobalDialog } from '~/stores/global-dialogs'
import { useCable } from '~/stores/cable'

const router = useRouter()
const { height } = useWindowSize()
const globalDialogs = useGlobalDialog()
const user = useUser()
const cable = useCable()
const mute = ref(false)
const messageToHall = ref('')
const messageFromDoor = 'I prefer not to say. where are you at?where are you at?'
const messageFromDoorInBubble = ref('')

function onDoorImageLoad() {
  globalDialogs.showingLoadingDialog = false
  const pause = useIntervalFn(() => {
    messageFromDoorInBubble.value += messageFromDoor[messageFromDoorInBubble.value.length]
    if (messageFromDoorInBubble.value === messageFromDoor)
      pause.pause()
  }, 50)
}

onMounted(() => {
  globalDialogs.showingLoadingDialog = true
})
</script>

<template>
  <div class="bg-chat absolute left-0 top-0 h-full w-full" />
  <div class="bg-match absolute left-0 top-0 h-full w-full" />
  <div
    class="absolute left-0 top-0 h-full w-full flex justify-center" :style="{
      transform: `scale(${height / 1080})`,
    }"
  >
    <img class="h-208.5 w-127.5 object-contain" src="../assets/img/door.gif" @load="onDoorImageLoad">
  </div>
  <div
    class="absolute left-0 h-full w-full flex justify-center pt-40" :style="{
      transform: `scale(${height / 1080})`,
    }"
  >
    <div class="bg-bubble h-40 w-129 px-8 pt-9 text-10 font-bold leading-8 font-neue-bit text-white">
      {{ messageFromDoorInBubble }}
    </div>
  </div>
  <div class="absolute left-0 top-0 h-full w-full flex flex-col">
    <!-- header -->
    <div class="w-full flex justify-center">
      <div class="max-w-1200px w-full flex justify-between p-5">
        <!-- back -->
        <div class="w-33 flex cursor-pointer items-center justify-center b-2px b-[rgba(255,255,255,0.25)] transition-colors hover:bg-[rgba(255,255,255,0.25)]" @click="router.push('/')">
          <img srcset="../assets/img/icon_exit_1x.png 1x, ../assets/img/icon_exit_2x.png 2x" height="24">
          <div class="mr-4 flex items-center text-5 font-bold font-neue-bit text-white">
            Home
          </div>
        </div>
        <!-- info -->
        <div class="flex cursor-pointer items-center justify-center gap-x-2 b-2px b-[rgba(255,255,255,0.25)] px-3.5 transition-colors hover:bg-[rgba(255,255,255,0.25)]">
          <img :src="user.user?.avatar" height="24" width="24" class="rounded-5px">
          <img srcset="../assets/img/lucky_1x.png 1x, ../assets/img/lucky_2x.png 2x" height="24">
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
    <div v-if="user.user" class="absolute bottom-10 w-full flex justify-center gap-2 p-2">
      <div class="max-w-224 w-full flex border-0.5rem border-b-#808080 border-l-#e6e6e6 border-r-#808080 border-t-#e6e6e6 bg-#ccc p-2.5">
        <input v-model="messageToHall" class="h-full max-w-171 w-full border-0.25rem border-b-#ccc border-l-black border-r-#ccc border-t-black px-4 text-8 font-bold font-neue-bit outline-2px outline-black outline-solid focus:outline-2px focus:outline-black" placeholder="Your secret message">
        <Button class="ml-5 text-8 leading-6" @click="cable.sendToHall(messageToHall, user.user);messageToHall = ''">
          <div class="flex items-center justify-center px-5">
            <img class="object-contain" src="../assets/img/icon_send.svg" width="22" height="22">
            <div class="ml-3">
              Send
            </div>
          </div>
        </Button>
      </div>
      <div class="flex flex-shrink-0 border-0.5rem border-b-#808080 border-l-#e6e6e6 border-r-#808080 border-t-#e6e6e6 bg-#ccc p-2.5">
        <Button class="text-8 leading-6" no-padding>
          <div class="bg-gradient flex items-center justify-center px-7 py-1">
            <img class="object-contain" srcset="../assets/img/icon_earth_1x.png 1x, ../assets/img/icon_earth_2x.png 2x" width="22" height="22">
            <div class="ml-3">
              Random
            </div>
          </div>
        </Button>
        <img v-if="!mute" class="ml-5 display-box flex-shrink-0 object-contain" srcset="../assets/img/icon_disk_music_1x.png 1x, ../assets/img/icon_disk_music_2x.png 2x" width="50" height="50">
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.bg-chat {
  background-color: black;
  background-image: url(../assets/img/bg_chat.gif);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.bg-match {
  background-image: url(../assets/img/bg_match.png);
  background-position: bottom;
  background-size: 1920px 360px;
  background-repeat: no-repeat;
}

.door {
  background-image: url(../assets/img/door.gif);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.bg-gradient {
  background-image: linear-gradient(77deg, #ECC7DD 0%, #C8E7E0 54%, #FBEFC5 100%);
}

.bg-bubble {
  background-image: url(../assets/img/bubble_from_door.svg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
