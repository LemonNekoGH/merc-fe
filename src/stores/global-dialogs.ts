import { useTimeoutFn } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface AlertParams {
  show: boolean
  title: 'Info' | 'Error'
  message: string
  onClose?: () => void
  asHtml: boolean
}

export const useGlobalDialog = defineStore('globalDialog', () => {
  const alertParams = ref<AlertParams>({
    show: false,
    title: 'Info',
    message: '',
    asHtml: false,
  })

  const showRegisterDialog = ref(false)
  const showingLoadingDialog = ref(false)

  const showAlert = (message: string, title: 'Info' | 'Error' = 'Error', onClose?: () => void, asHtml: boolean = false) => {
    alertParams.value = {
      show: true,
      title,
      message,
      onClose,
      asHtml,
    }
  }

  const closeAlert = () => {
    alertParams.value.onClose?.()

    alertParams.value = {
      show: false,
      title: 'Info',
      message: '',
      onClose: undefined,
      asHtml: false,
    }
  }

  const showLoading = (timeout: number = 2000) => {
    showingLoadingDialog.value = true
    useTimeoutFn(() => showingLoadingDialog.value = false, timeout)
  }

  return {
    alertParams,
    showAlert,
    closeAlert,
    showRegisterDialog,
    showLoading,
    showingLoadingDialog,
  }
})
