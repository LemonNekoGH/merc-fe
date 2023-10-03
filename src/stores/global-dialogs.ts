import { useTimeoutFn } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalDialog = defineStore('globalDialog', () => {
  const alertParams = ref({
    show: false,
    title: '',
    message: '',
  })

  const showRegisterDialog = ref(false)
  const showingLoadingDialog = ref(false)

  const showAlert = (message: string, title: 'Info' | 'Error' = 'Error') => {
    alertParams.value = {
      show: true,
      title,
      message,
    }
  }

  const closeAlert = () => alertParams.value = {
    show: false,
    title: '',
    message: '',
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
