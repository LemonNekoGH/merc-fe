<script setup lang="ts"></script>

<template>
  <div class="border-0.5rem border-b-#808080 border-l-#e6e6e6 border-r-#808080 border-t-#e6e6e6 bg-#ccc p-5 pt-0px">
    <!-- head -->
    <div class="h-13 flex items-end justify-end pb-12px">
      <div class="close-btn h-6 w-6" />
    </div>
    <!-- body -->
    <div class="bg-black p-5">
      <slot />
    </div>
  </div>
</template>
