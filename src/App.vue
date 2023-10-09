<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Dialog from './components/dialog.vue'
import RegisterDialog from './components/register-dialog.vue'
import LoadingDialog from './components/loading-dialog.vue'

import { useGlobalDialog } from './stores/global-dialogs'
import { useUser } from './stores/user'

const router = useRouter()

const globalDialogs = useGlobalDialog()
const user = useUser()

onMounted(async () => {
  // try get session
  await user.getSession()
  if (!user.user) {
    router.push('/')
    return
  }
  // complete register
  if (!user.user.gender || !user.user.nickname || !user.user.avatar) {
    router.push('/')
    globalDialogs.showRegisterDialog = true
  }
})
</script>

<template>
  <RouterView />
  <RegisterDialog
    v-if="globalDialogs.showRegisterDialog"
    @close="globalDialogs.showRegisterDialog = false"
  />
  <Dialog
    v-if="globalDialogs.alertParams.show"
    :title="globalDialogs.alertParams.title" @close="globalDialogs.closeAlert"
  >
    <div class="text-9 font-bold font-neue-bit text-white">
      {{ globalDialogs.alertParams.message }}
    </div>
  </Dialog>
  <LoadingDialog v-if="globalDialogs.showingLoadingDialog" />
</template>
