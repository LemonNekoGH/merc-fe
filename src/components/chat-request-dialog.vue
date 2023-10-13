<script setup lang="ts">
import type { ChatRequestDialogProps } from '../types/ui'
import Receive from './chat-request/receive.vue'
import Request from './chat-request/request.vue'

defineProps<{
  info: ChatRequestDialogProps
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Receive v-if="info.from" :id="info.id" :message="{ message: info.message, from: info.from }" @close="emit('close')" />
  <Request v-if="info.to" :id="info.id" :message="{ message: info.message, from: info.to }" :error="info.error" @close="emit('close')" />
</template>
