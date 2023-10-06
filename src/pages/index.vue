<script setup lang="ts">
import Button from '../components/button.vue'
import { api } from '../api'
import { useEth } from '~/stores/eth'
import { isSuccess } from '~/restful'
import { useUser } from '~/stores/user'
import { useGlobalDialog } from '~/stores/global-dialogs'

const eth = useEth()
const globalDialogs = useGlobalDialog()
const user = useUser()

async function loginByMetamask() {
  try {
    await eth.connectWallet()
    const msg = await api.sessions.getMessage()
    if (!isSuccess(msg))
      throw new Error('Unknown error, please try again.')

    const signedMsg = await eth.signMessage(msg.data)
    // try login
    const errCode = await user.login(msg.data, signedMsg, eth.userAddr)
    if (errCode === 40401) {
      // try register
      await user.create(msg.data, signedMsg, eth.userAddr)
      globalDialogs.showRegisterDialog = true
    }
  }
  catch (e) {
    console.error((e as Error).message)
    globalDialogs.showAlert((e as Error).message, 'Error')
  }
}
</script>

<template>
  <div class="index-bg h-full w-full flex flex-col">
    <!-- header -->
    <div v-if="user.user" class="max-w-1200px w-full flex justify-end p-5">
      <div class="flex items-center b-2px b-[rgba(255,255,255,0.25)] px-4 py-2">
        <img srcset="../assets/img/icon_wallet_2_1x.png 1x, ../assets/img/icon_wallet_2_2x.png 2x" height="24">
        <div class="ml-4 flex items-center pt-2 text-5 font-bold font-neue-bit text-white">
          {{ user.user.address }}
        </div>
      </div>
      <Button class="ml-5 text-3 font-press-start" @click="user.logout">
        <div class="flex items-center justify-center px-5">
          <img class="h-8 w-8 object-contain" src="../assets/img/icon_windows_98.svg">
          <div class="ml-3">
            Logout
          </div>
        </div>
      </Button>
    </div>
    <div class="h-full max-w-1200px w-full flex flex-col items-center justify-center">
      <!-- main -->
      <div class="bg-logo h-22 w-22" />
      <div class="mt-4 text-4 font-normal font-press-start text-white/50">
        Mercurius Club
      </div>
      <div class="mt-40px text-14 font-700 font-fraunces text-white">
        Chatting Brings You Luck
      </div>
      <template v-if="!user.user">
        <Button class="mt-36 w-135 text-7">
          <div class="flex items-center px-4">
            <div class="h-full w-9 pb-1.5">
              <img srcset="../assets/img/icon_wallet_1x.png 1x, ../assets/img/icon_wallet_2x.png 2x">
            </div>
            <div class="ml-3 flex-1" @click="loginByMetamask">
              Connect Wallet
            </div>
            <img srcset="../assets/img/icon_arrow_1x.png 1x, ../assets/img/icon_arrow_2x.png 2x">
          </div>
        </Button>
        <Button class="mt-6 w-135 text-7">
          <div class="flex items-center px-4">
            <div class="h-full w-9 pb-1.5">
              <img srcset="../assets/img/icon_email_1x.png 1x, ../assets/img/icon_email_2x.png 2x">
            </div>
            <div class="ml-3 flex-1">
              Login/Register using email
            </div>
            <img srcset="../assets/img/icon_arrow_1x.png 1x, ../assets/img/icon_arrow_2x.png 2x">
          </div>
        </Button>
        <div class="mt-6 w-490px text-6 font-bold leading-6 font-neue-bit text-white/50">
          By signing in, you agree to Mercurius Labs Studio's <span class="text-white">Terms of Use</span> and <span class="text-white">Privacy Policy</span>
        </div>
      </template>
      <Button v-else class="mt-35 w-92.5 text-9 leading-8">
        <div class="flex items-center justify-center p-2">
          <img class="h-8 w-8 object-contain" src="../assets/img/icon_heart_message.svg">
          <div class="ml-3">
            Chat Room
          </div>
        </div>
      </Button>
    </div>
  </div>
</template>

<style scoped>
.index-bg {
  background-image: url(../assets/img/bg_pc.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

@media screen and (max-width: 768px) {
  .index-bg {
    background-image: url(../assets/img/bg_mobile.png);
  }
}
</style>
