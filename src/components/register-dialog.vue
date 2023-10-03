<script setup lang="ts">
import { ref } from 'vue'
import Dialog from './dialog.vue'
import Button from './button.vue'
import { useUser } from '~/stores/user'

import genderMale1x from '~/assets/img/gender_male_1x.png'
import genderMale2x from '~/assets/img/gender_male_2x.png'
import genderFemale1x from '~/assets/img/gender_female_1x.png'
import genderFemale2x from '~/assets/img/gender_female_2x.png'
import genderOther1x from '~/assets/img/gender_other_1x.png'
import genderOther2x from '~/assets/img/gender_other_2x.png'
import genderAny1x from '~/assets/img/gender_any_1x.png'
import genderAny2x from '~/assets/img/gender_any_2x.png'
import { useGlobalDialog } from '~/stores/global-dialogs'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const globalDialogs = useGlobalDialog()
const user = useUser()
const genders = [
  { gender: 'Male', icon: `${genderMale1x} 1x,${genderMale2x} 2x` },
  { gender: 'Female', icon: `${genderFemale1x} 1x,${genderFemale2x} 2x` },
  { gender: 'Other', icon: `${genderOther1x} 1x,${genderOther2x} 2x` },
  { gender: 'Any', icon: `${genderAny1x} 1x,${genderAny2x} 2x` },
]
const selectingGender = ref('')

async function selectGender() {
  try {
    globalDialogs.showLoading()
    await user.update({ gender: selectingGender.value })
  }
  catch (e) {
    globalDialogs.showAlert((e as Error).message)
  }
}
</script>

<template>
  <Dialog v-if="user.user" :hide-close-btn="!user.user.gender || !user.user.nickname || !user.user.avatar" @close="emit('close')">
    <div class="h-110 w-203 font-bold font-neue-bit">
      <div v-if="!user.user.gender" class="flex flex-col items-center justify-center">
        <div class="text-16 text-white">
          Select your gender
        </div>
        <div class="mt-12.5 flex gap-14">
          <div
            v-for="gender in genders"
            :key="gender.gender"
            class="gender-item cursor-pointer select-none"
            :class="[selectingGender === gender.gender ? 'gender-item-selected' : '']"
            @click="selectingGender = gender.gender"
          >
            <div class="gender-item-border h-0.5 transform -translate-y-0.5" />
            <div class="p-2">
              <img :srcset="gender.icon" width="80" height="70">
              <div class="mt-2 text-center text-8 text-white">
                {{ gender.gender }}
              </div>
            </div>
            <div class="gender-item-border h-0.5 translate-y-0.5 transform" />
          </div>
        </div>
        <Button class="mt-17 w-44.5 text-8 leading-8" :disabled="selectingGender === ''" @click="selectGender">
          <div class="w-full text-center">
            Enter
          </div>
        </Button>
      </div>
      <div v-else-if="!user.user.nickname">
        <div>Input your nickname</div>
        <Button>Enter</Button>
      </div>
      <div v-else-if="!user.user.avatar">
        <div>Select a avatar</div>
        <Button>Enter</Button>
      </div>
      <div v-else>
        <div>You are all done!</div>
        <Button>Enter</Button>
      </div>
    </div>
  </Dialog>
</template>

<style lang="less" scoped>
.gender-item {
  border-left: 2px #353535 solid;
  border-right: 2px #353535 solid;
  transition: all 250ms;

  &-border {
    background-color: #353535;
    transition: all 250ms;
  }

  &:hover {
    border-left: 2px rgba(255,255,255,0.7) solid;
    border-right: 2px rgba(255,255,255,0.7) solid;

    .gender-item-border {
      background-color: rgba(255,255,255,0.7);
    }
  }

  &-selected {
    border-left: 2px rgba(255,255,255,0.7) solid;
    border-right: 2px rgba(255,255,255,0.7) solid;

    .gender-item-border {
      background-color: rgba(255,255,255,0.7);
    }
  }
}
</style>
