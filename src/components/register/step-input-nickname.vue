<script setup lang="ts">
import { ref } from 'vue'
import Button from '../button.vue'
import Dialog from '../dialog.vue'
import { useGlobalDialog } from '~/stores/global-dialogs'
import { useUser } from '~/stores/user'

const globalDialogs = useGlobalDialog()
const user = useUser()
const nickname = ref('')
const error = ref('')

async function submitNickname() {
  try {
    if (!nickname.value)
      throw new Error('Name is empty.')
    globalDialogs.showLoading()
    await user.update({ nickname: nickname.value })
  }
  catch (e) {
    error.value = (e as Error).message
  }
}
</script>

<template>
  <Dialog :hide-close-btn="true">
    <div class="h-110 w-203 font-bold font-neue-bit">
      <div class="flex flex-col items-center justify-center">
        <div class="text-16 text-white selection:bg-white selection:text-black">
          Enter your nickname
        </div>
        <!-- Input -->
        <div class="mt-18">
          <div class="ml-1 h-1 w-135.5 bg-white" />
          <div class="w-137.5 flex">
            <div class="h-11 w-1 bg-white" />
            <input v-model="nickname" class="font bold flex-1 bg-black px-4 text-center text-8 text-white caret-#07F0FF focus:outline-none">
            <div class="h-11 w-1 bg-white" />
          </div>
          <div class="ml-1 h-1 w-135.5 bg-white" />
        </div>
        <div class="mt-4 text-6.5 font-normal text-#FF4480">
          &nbsp;{{ error }}&nbsp;
        </div>
        <Button class="mt-21.5 w-44.5 text-8 leading-8" :disabled="!nickname" @click="submitNickname">
          <div class="w-full text-center">
            Enter
          </div>
        </Button>
      </div>
    </div>
  </Dialog>
</template>
