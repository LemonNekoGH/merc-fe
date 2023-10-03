<script setup lang="ts">
import { ref } from 'vue'
import Button from '../components/button.vue'
import Dialog from '../components/dialog.vue'

const showDialog = ref(false)
</script>

<template>
  <Dialog v-if="showDialog" @close="showDialog = false">
    <div class="text-9 font-bold font-neue-bit text-white">
      DIALOG CONTENT
    </div>
  </Dialog>
  <Button @click="showDialog = true">
    BUTTON
  </Button>
</template>
