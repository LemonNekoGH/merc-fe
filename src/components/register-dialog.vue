<script setup lang="ts">
import StepSelectGender from './register/step-select-gender.vue'
import StepInputNickname from './register/step-input-nickname.vue'
import StepUploadAvatar from './register/step-upload-avatar.vue'
import StepDone from './register/step-done.vue'
import { useUser } from '~/stores/user'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const user = useUser()
</script>

<template>
  <div v-if="user.user" :hide-close-btn="!user.user.gender || !user.user.nickname || !user.user.avatar" @close="emit('close')">
    <StepSelectGender v-if="!user.user.gender" />
    <StepInputNickname v-else-if="!user.user.nickname" />
    <StepUploadAvatar v-else-if="!user.user.avatar" />
    <StepDone v-else />
  </div>
</template>
