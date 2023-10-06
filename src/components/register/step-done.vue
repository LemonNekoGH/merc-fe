<script setup lang="ts">
import { ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { toBlob } from 'html-to-image'
import Button from '../button.vue'
import Dialog from '../dialog.vue'
import { useGlobalDialog } from '~/stores/global-dialogs'
import { useUser } from '~/stores/user'

defineProps<{
  image: string
}>()

const emit = defineEmits<{
  (e: 'reset' | 'close'): void
}>()

const globalDialogs = useGlobalDialog()
const user = useUser()

const { height } = useWindowSize()
const confirmed = ref(false)
const nftPass = ref<HTMLDivElement>()

async function updateAvatar(avatar: string) {
  try {
    globalDialogs.showLoading()
    await user.update({ avatar })
    confirmed.value = true
  }
  catch (e) {
    globalDialogs.showAlert((e as Error).message)
  }
}

async function downloadSBT() {
  const link = URL.createObjectURL((await toBlob(nftPass.value!))!)
  const linkEl = document.createElement('a')
  linkEl.href = link
  linkEl.download = 'MyNFTPass_MercuriusClub.png'
  linkEl.click()
}
</script>

<template>
  <div class="absolute left-0 top-0 h-full w-full bg-black/20" />
  <Dialog
    :title="confirmed ? 'Invitation' : 'Your SBT is ready!'" no-mask :hide-close-btn="true" :style="{
      transform: `scale(${height / 1080})`,
    }"
  >
    <div v-if="!confirmed" class="h-199.5 w-183 flex flex-col items-center justify-center pt-20">
      <div class="perspective-100rem">
        <div ref="nftPass" class="bg-nft-pass h-101 w-62.5 px-5 pb-24 pt-24">
          <div class="h-full w-full !bg-cover !bg-center !bg-no-repeat" :style="{ backgroundImage: `url(${image})` }" />
        </div>
      </div>
      <!-- buttons -->
      <div class="mt-11 flex gap-7.5">
        <Button class="w-44.5 text-8 leading-8" @click="emit('reset')">
          <div class="flex items-center justify-center">
            <img
              class="h-5 w-8 object-contain"
              srcset="../../assets/img/icon_camera_1x.png 1x,../../assets/img/icon_camera_2x.png 2x"
            >
            <div class="ml-1.5">
              Retake
            </div>
          </div>
        </Button>
        <Button class="w-44.5 text-8 leading-8" @click="updateAvatar(image)">
          <div class="flex items-center justify-center">
            <img
              class="h-5 w-8 object-contain"
              srcset="../../assets/img/icon_save_1x.png 1x,../../assets/img/icon_save_2x.png 2x"
            >
            <div class="ml-1.5">
              Enter
            </div>
          </div>
        </Button>
      </div>
      <!-- share -->
      <div class="mt-14 flex items-center justify-center gap-7">
        <div class="h-0.5 w-60 bg-[rgba(255,255,255,0.2)]" />
        <div class="text-6.5 font-bold font-neue-bit text-white">
          Share your SBT
        </div>
        <div class="h-0.5 w-60 bg-[rgba(255,255,255,0.2)]" />
      </div>
      <!-- download -->
      <div class="mt-7 flex flex-col cursor-pointer items-center justify-center" @click="downloadSBT">
        <img srcset="../../assets/img/icon_download_1x.png 1x, ../../assets/img/icon_download_2x.png 2x">
        <div class="mt-3 text-3 font-press-start text-white">
          Download
        </div>
      </div>
    </div>
    <div v-else class="h-199.5 w-183 flex flex-col justify-center p-4 text-10 font-bold font-neue-bit text-white">
      <div class="flex justify-center">
        <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
          <path
            fill-rule="evenodd" clip-rule="evenodd"
            d="M46.9078 0.35498H103.092L103.092 9.18377H123.158V18.0126H131.987V26.8416H123.158V18.0128H103.092L103.092 9.18398H46.9078V18.0128H26.8419L26.8419 26.8416H18.0129V18.0126H26.8419L26.8419 9.18377H46.9078V0.35498ZM46.1051 112.724H103.895V121.553H46.1051V112.724ZM55.7367 71.9131V33.3865H46.9077L46.9077 71.9131H55.7367ZM37.6774 103.092V92.226H29.0645V103.71H37.2761V112.724H46.1051V103.092H37.6774ZM112.724 103.71V112.724H103.895V103.092H112.323V92.226H120.936V103.71H112.724ZM103.092 33.3865V71.9131H94.2633V33.3865H103.092ZM26.8419 131.987H46.9078V140.816H26.8419L26.8419 131.987H18.0129V123.158H26.8419L26.8419 131.987ZM9.18386 103.895H18.0129V123.158H9.18386V103.895ZM18.0129 26.842H9.18386V46.1053H18.0129V26.842ZM0.354858 46.1047H9.18386V103.895H0.354858V46.1047ZM103.092 131.987H123.158V123.158H131.987V131.987H123.158V140.816H103.092V131.987ZM131.987 103.895H140.816V123.158H131.987V103.895ZM140.816 26.842H131.987V46.1053H140.816V103.895H149.645V46.1047H140.816V26.842ZM103.092 140.817H46.9078V149.646H103.092V140.817Z"
            fill="url(#paint0_linear_745_46212)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_745_46212" x1="123.5" y1="13" x2="27.5" y2="134.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#37DDFF" />
              <stop offset="0.46875" stop-color="#FFD850" />
              <stop offset="1" stop-color="#FF86F3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="mt-16 leading-10">
        Dear Prayers,
      </div>
      <div class="mt-12 leading-10">
        I'm inviting you to the Matching Alter, assigning you with chat mates for real connections.
      </div>
      <div class="mt-10 leading-10">
        Have fun,<br> Mercurius
      </div>
      <div class="mt-36 flex justify-center">
        <Button class="w-44.5 text-8 leading-8 text-black" @click="emit('close')">
          <div class="text-center">
            Enter
          </div>
        </button>
      </div>
    </div>
  </Dialog>
</template>

<style lang="less" scoped>
@keyframes animate-rotate {
  0% {
    transform: rotateY(0);
  }

  20% {
    transform: rotateY(-360deg);
  }

  40% {
    transform: rotateY(-785deg);
  }

  50% {
    transform: rotateY(-685deg);
  }

  70%,
  100% {
    transform: rotateY(-720deg);
  }
}

.bg-nft-pass {
  background-image: url(../../assets/img/nft_pass_border.png);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;

  animation: animate-rotate 3s linear infinite;
}
</style>
