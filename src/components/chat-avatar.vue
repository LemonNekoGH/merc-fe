<script setup lang="ts">
defineProps<{
  avatar: string
  name: string
}>()
</script>

<template>
  <div class="bg h-75.5 w-68">
    <div :style="{ backgroundImage: `url(${avatar})` }" class="relative left-4 top-4 h-60 w-60 !bg-cover !bg-center !bg-no-repeat" />
    <div class="relative top-6 flex justify-center">
      <div class="name px-5 text-5 font-bold leading-6 font-neue-bit selection:bg-black selection:text-white">
        {{ name }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.bg {
  background-image: url(../assets/img/avatar_border_1x.png);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
.name {
  background: #C0C0C0;
  box-shadow: 1px 1px 0px 0px #878787 inset, 1px 1px 0px 0px #FFF;
}

@media screen and (min-resolution: 2dppx) {
  .bg {
    background-image: url(../assets/img/avatar_border_2x.png);
  }
}
</style>
