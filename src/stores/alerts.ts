import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlert = defineStore('alert', () => {
  const alertParams = ref({
    show: false,
    title: '',
    message: '',
  })

  const show = (message: string, title: 'Info' | 'Error' = 'Error') => {
    alertParams.value = {
      show: true,
      title,
      message,
    }
  }

  const close = () => alertParams.value = {
    show: false,
    title: '',
    message: '',
  }

  return {
    alertParams,
    show,
    close,
  }
})
