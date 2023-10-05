<script setup lang="ts">
import { ref } from 'vue'
import Button from '../button.vue'
import Dialog from '../dialog.vue'
import { useGlobalDialog } from '~/stores/global-dialogs'
import { useUser } from '~/stores/user'

const globalDialogs = useGlobalDialog()
const user = useUser()
const nickname = ref('')

async function submitNickname() {
  try {
    globalDialogs.showLoading()
    await user.update({ nickname: nickname.value })
  }
  catch (e) {
    globalDialogs.showAlert((e as Error).message)
  }
}
</script>

<template>
  <div>Input your nickname</div>
  <Button>Enter</Button>
</template>
