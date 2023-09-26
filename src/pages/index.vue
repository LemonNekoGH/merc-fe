<script setup lang="ts">
import Button from '../components/button.vue'
</script>

<template>
  <div class="index-bg h-full w-full flex justify-center">
    <div class="h-full max-w-1200px w-full flex flex-col items-center justify-center">
      <div class="bg-logo h-22 w-22" />
      <div class="font-press-start mt-4 text-4 font-normal text-white/50">
        Mercurius Club
      </div>
      <div class="font-fraunces mt-40px text-14 font-700 text-white">
        Chatting Brings You Luck
      </div>
      <Button class="mt-36 w-135 text-7">
        <div class="flex items-center px-4">
          <div class="h-full w-9 pb-1.5">
            <img srcset="../assets/img/icon_wallet_1x.png 1x, ../assets/img/icon_wallet_2x.png 2x">
          </div>
          <div class="ml-3 flex-1">
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
      <div class="font-neue-bit mt-6 w-490px text-6 leading-6 text-white/50">
        By signing in, you agree to Mercurius Labs Studio's <span class="text-white">Terms of Use</span> and <span class="text-white">Privacy Policy</span>
      </div>
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
