<script setup lang="ts">
import { ref } from 'vue'
import StepSelectGender from './register/step-select-gender.vue'
import StepInputNickname from './register/step-input-nickname.vue'
import StepUploadAvatar from './register/step-upload-avatar.vue'
import StepDone from './register/step-done.vue'
import { useUser } from '~/stores/user'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const user = useUser()
const processedImage = ref('')

function avatarProcessDone(it: string) {
  processedImage.value = it
}
</script>

<template>
  <div v-if="user.user" :hide-close-btn="!user.user.gender || !user.user.nickname || !user.user.avatar">
    <StepSelectGender v-if="!user.user.gender" />
    <StepInputNickname v-else-if="!user.user.nickname" />
    <StepUploadAvatar v-else-if="!user.user.avatar && !processedImage" @process-done="avatarProcessDone" />
    <StepDone v-else-if="processedImage" :image="processedImage" @close="emit('close')" @reset="processedImage = ''" />
  </div>
</template>
