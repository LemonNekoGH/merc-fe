<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { toPng } from 'html-to-image'
import Button from '../button.vue'
import Dialog from '../dialog.vue'
import { useGlobalDialog } from '~/stores/global-dialogs'

const emit = defineEmits<{
  (e: 'processDone', image: string): void
}>()

const globalDialogs = useGlobalDialog()

const { height } = useWindowSize()
const takingPic = ref(false) // will receive camera
const uploadedPic = ref('') // will ask for scale image after uploaded, or retake
const step = ref(0)
const progress = ref(0)
const scale = ref(1)
const cameraHeight = ref(0)
const scalingAnimationFrame = ref(-1)
const camera = ref<HTMLVideoElement>()
const pictureContainer = ref<HTMLDivElement>()

async function openCamera() {
  try {
    takingPic.value = true
    await nextTick()

    if (!camera.value)
      throw new Error('Camera element not available')

    const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true })
    camera.value.srcObject = cameraStream
    camera.value.play()
  }
  catch (e) {
    globalDialogs.showAlert((e as Error).message)
    takingPic.value = false
  }
}

function startScale(dt: number) {
  const scaleFunc = () => {
    if (scale.value >= 1 || dt > 0)
      scale.value += dt

    scalingAnimationFrame.value = requestAnimationFrame(scaleFunc)
  }

  scaleFunc()
}

function stopScale() {
  cancelAnimationFrame(scalingAnimationFrame.value)
}

async function increaseProgress() {
  if (progress.value === 29) {
    // clip image to square shape
    const img = document.createElement('div')
    img.style.width = '360px'
    img.style.height = '360px'
    img.style.backgroundImage = `url(${uploadedPic.value})`
    img.style.backgroundPosition = 'center'
    img.style.backgroundSize = 'cover'
    document.body.appendChild(img)

    // export image
    const squareAvatar = await toPng(img)
    img.remove()

    // to next step
    emit('processDone', squareAvatar)
    return
  }
  progress.value += 1
  setTimeout(increaseProgress, 250)
}

async function processSBT() {
  // give default value
  if (cameraHeight.value === 0)
    (cameraHeight.value = 333)
  // capture picture container and reset scale
  const scaledPic = await toPng(pictureContainer.value!)
  scale.value = 1
  await nextTick()
  // start process
  const img = new Image()
  img.width = 495
  img.height = 333
  img.style.imageRendering = 'pixelate'
  img.src = scaledPic
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 495
    canvas.height = cameraHeight.value
    const ctx = canvas.getContext('2d')!
    ctx.imageSmoothingEnabled = false // disable smooth
    // draw smaller image
    ctx.drawImage(img, 0, 0, 495 * 0.1, cameraHeight.value * 0.1)
    // scale to normal size
    ctx.drawImage(canvas, 0, 0, 495 * 0.1, cameraHeight.value * 0.1, 0, 0, 495, cameraHeight.value)

    // export image
    uploadedPic.value = canvas.toDataURL()
  }

  step.value = 2
  increaseProgress()
}

function takePic() {
  const canvas = document.createElement('canvas')

  canvas.width = 495
  cameraHeight.value = camera.value!.videoHeight / (camera.value!.videoWidth / 495)
  canvas.height = cameraHeight.value

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    globalDialogs.showAlert('Canvas not available')
    return
  }

  ctx.drawImage(camera.value!, 0, 0, canvas.width, canvas.height)
  const imageData = canvas.toDataURL()
  uploadedPic.value = imageData
  step.value = 1
  takingPic.value = false
}

function uploadPic() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    if (!input.files || input.files.length === 0) {
      globalDialogs.showAlert('No files selected')
      return
    }

    const f = input.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(f)
    reader.onload = () => {
      uploadedPic.value = reader.result as string
      step.value = 1
    }
  }
  input.click()
}

const title = (() => {
  const allTitle = ['Take/Upload a picture to create your SBT', 'You may edit your image', 'Your SBT image is processing...']
  return computed(() => allTitle[step.value])
})()
</script>

<template>
  <div class="absolute left-0 top-0 h-full w-full bg-black/20" />
  <Dialog
    :title="title" no-mask :hide-close-btn="true" :style="{
      transform: `scale(${height / 1080})`,
    }"
  >
    <div class="h-199.5 w-183 flex flex-col items-center justify-center">
      <div class="computer h-132.5 w-160 px-18 pb-34.5 pt-15">
        <!-- screen -->
        <video v-if="takingPic" ref="camera" width="495" class="h-83.5 w-124.5">
          Waiting for signal...
        </video>
        <div
          v-else-if="uploadedPic"
          ref="pictureContainer"
          class="overflow-hidden"
        >
          <div
            class="h83.5 w-124.5 !bg-contain !bg-center !bg-no-repeat"
            :style="{
              backgroundImage: `url(${uploadedPic})`,
              transform: `scale(${scale})`,
            }"
          >
            <div v-if="step === 2" class="h-full w-full flex flex-col items-center bg-black/50 pt-34">
              <!-- progress bar -->
              <div>
                <div class="ml-1.25 h-1.25 w-89.5 bg-white" />
                <div class="flex">
                  <div class="h-5 w-1.25 bg-white" />
                  <div class="h-5 w-89.5 flex gap-x-1 px-2 py-1">
                    <div v-for="p in Array(progress)" :key="p" class="h-full w-2 bg-white" />
                  </div>
                  <div class="h-5 w-1.25 bg-white" />
                </div>
                <div class="ml-1.25 h-1.25 w-89.5 bg-white" />
              </div>
              <div class="mt-6 text-center text-10 font-bold leading-10 font-neue-bit text-white">
                Production may takes 1 hour, we will inform you after production
              </div>
            </div>
          </div>
        </div>
        <div v-else class="place-holder h-full w-full" />
      </div>
      <!-- scale -->
      <div v-if="step === 1" class="mt-10 h-12 w-50 flex border-2px border-[rgba(255,255,255,0.3)]">
        <div
          class="flex flex-1 items-center justify-center py-1.5"
          @mousedown="startScale(0.01)" @mouseup="stopScale" @mouseout="stopScale"
        >
          <img srcset="../../assets/img/icon_scale_up_1x.png 1x, ../../assets/img/icon_scale_up_2x.png 2x" class="pointer-events-none">
        </div>
        <div class="h-full w-2px bg-[rgba(255,255,255,0.3)]" />
        <div
          class="flex flex-1 items-center justify-center py-1.5"
          @mousedown="startScale(-0.01)" @mouseup="stopScale" @mouseout="stopScale"
        >
          <img srcset="../../assets/img/icon_scale_down_1x.png 1x, ../../assets/img/icon_scale_down_2x.png 2x" class="pointer-events-none">
        </div>
      </div>
      <div class="flex gap-7.5" :class="step === 1 ? 'mt-8' : 'mt-30'">
        <Button v-if="step === 0" class="w-44.5 text-8 leading-8" @click="takingPic ? takePic() : openCamera()">
          <div class="flex justify-center">
            <img class="h-8 w-8 object-contain" srcset="../../assets/img/icon_camera_1x.png 1x,../../assets/img/icon_camera_2x.png 2x">
            <div class="ml-1.5">
              Take
            </div>
          </div>
        </Button>
        <Button v-if="takingPic" class="w-44.5 text-8 leading-8" @click="takingPic = false">
          <div class="flex items-center justify-center">
            <img class="h-6 w-6 object-contain" src="../../assets/img/icon_cancel.svg">
            <div class="ml-1.5">
              Cancel
            </div>
          </div>
        </Button>
        <Button v-if="step === 0 && !takingPic" class="w-44.5 text-8 leading-8" @click="uploadPic">
          <div class="flex items-center justify-center">
            <img class="h-6 w-6 object-contain" srcset="../../assets/img/icon_upload_1x.png 1x,../../assets/img/icon_upload_2x.png 2x">
            <div class="ml-1.5">
              Upload
            </div>
          </div>
        </Button>
        <Button v-if="step === 1" class="w-44.5 text-8 leading-8" @click="uploadedPic = '';step = 0">
          <div class="w-full text-center">
            Reset
          </div>
        </Button>
        <Button v-if="step === 1" class="w-44.5 text-8 leading-8" @click="processSBT">
          <div class="w-full text-center">
            Enter
          </div>
        </Button>
        <Button v-if="step === 2" class="w-44.5 text-8 leading-8" @click="globalDialogs.showAlert('Currently not implemented. Communicating how to implement...')">
          <div class="w-full text-center">
            Close
          </div>
        </Button>
      </div>
    </div>
  </Dialog>
</template>

<style lang="less" scoped>
.computer {
  background-image: url(../../assets/img/computer_1x.png);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.place-holder {
  background-image: url(../../assets/img/place_holder_1x.png);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

@media screen and (min-resolution: 2dppx) {
  .computer {
    background-image: url(../../assets/img/computer_2x.png);
  }

  .place-holder {
    background-image: url(../../assets/img/place_holder_2x.png);
  }
}
</style>
