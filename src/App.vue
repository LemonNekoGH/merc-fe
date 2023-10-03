<script setup lang="ts">
import { onMounted } from 'vue'
import Dialog from './components/dialog.vue'

import { useAlert } from './stores/alerts'
import { useUser } from './stores/user'

const alert = useAlert()
const user = useUser()

onMounted(async () => {
  // try get session
  user.getSession()
})
</script>

<template>
  <RouterView />
  <Dialog v-if="alert.alertParams.show" :title="alert.alertParams.title" @close="alert.close">
    <div class="text-9 font-bold font-neue-bit text-white">
      {{ alert.alertParams.message }}
    </div>
  </Dialog>
</template>
