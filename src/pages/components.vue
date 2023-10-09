<script setup lang="ts">
import { ref } from 'vue'
import Button from '../components/button.vue'
import Bubble from '../components/bubble.vue'
import exampleMessageAvatar from '../assets/img/place_holder_1x.png'
import ChatRequestDialog from '../components/chat-request-dialog.vue'
import ChatAvatar from '~/components/chat-avatar.vue'
import type { ChatRequestDialogProps } from '~/types/ui'
import { useGlobalDialog } from '~/stores/global-dialogs'

const globalDialogs = useGlobalDialog()

const like1 = ref(false)
const like2 = ref(false)
const like3 = ref(false)
const like4 = ref(false)
const chatRequestDialogProps = ref<ChatRequestDialogProps>()
const requestDialog1: ChatRequestDialogProps = {
  avatar: exampleMessageAvatar,
  name: 'Example Name',
  type: 'outcome',
  message: 'This is an outcome request dialog',
  error: '',
  sent: false,
  example: true,
}
const requestDialog2: ChatRequestDialogProps = {
  avatar: exampleMessageAvatar,
  name: 'Example Name',
  type: 'incoming',
  message: 'This is an incoming request dialog',
  error: '',
  sent: false,
  example: true,
}
const requestDialog3: ChatRequestDialogProps = {
  avatar: exampleMessageAvatar,
  name: 'Example Name',
  type: 'outcome',
  message: 'This is an outcome request dialog, but rejected',
  error: 'She/he rejected your request',
  sent: true,
  example: true,
}
const requestDialog4: ChatRequestDialogProps = {
  avatar: exampleMessageAvatar,
  name: 'Example Name',
  type: 'outcome',
  message: 'This is an outcome request dialog, but waiting',
  error: '',
  sent: true,
  example: true,
}
</script>

<template>
  <Button class="w-40" @click="globalDialogs.showAlert('This is a dialog')">
    Click To Show A Dialog
  </Button>
  <Button class="w-80" @click="globalDialogs.showLoading()">
    Click To Show A Loading Dialog
  </Button>
  <div class="mt-4 bg-black p-4">
    <Bubble
      message="Click avatar to show outcome request dialog"
      :left-to-right="true"
      :image="exampleMessageAvatar"
      :like="like1"
      @bubble-clicked="like1 = !like1"
      @avatar-clicked="chatRequestDialogProps = requestDialog1"
    />
  </div>
  <div class="bg-black p-4">
    <Bubble
      message="This is a very very very very very very long message. Click avatar to show incoming request dialog"
      :left-to-right="true"
      :image="exampleMessageAvatar"
      :like="like2"
      @bubble-clicked="like2 = !like2"
      @avatar-clicked="chatRequestDialogProps = requestDialog2"
    />
  </div>
  <div class="mt-4 flex justify-end bg-black p-4">
    <Bubble
      message="Click avatar to show outcome rejected dialog"
      :left-to-right="false"
      :image="exampleMessageAvatar"
      :like="like3"
      @bubble-clicked="like3 = !like3"
      @avatar-clicked="chatRequestDialogProps = requestDialog3"
    />
  </div>
  <div class="flex justify-end bg-black p-4">
    <Bubble
      message="This is a very very very very very very long message. Click avatar to show waiting dialog"
      :left-to-right="false"
      :image="exampleMessageAvatar"
      :like="like4"
      @bubble-clicked="like4 = !like4"
      @avatar-clicked="chatRequestDialogProps = requestDialog4"
    />
  </div>
  <ChatAvatar class="mt-4" :avatar="exampleMessageAvatar" name="LemonNeko" />
  <ChatRequestDialog v-if="chatRequestDialogProps" :info="chatRequestDialogProps" @close="chatRequestDialogProps = undefined" />
</template>
