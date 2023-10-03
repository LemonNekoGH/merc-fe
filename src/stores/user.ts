import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '~/api'
import type { User } from '~/api/types'
import { isSuccess } from '~/restful'

export const useUser = defineStore('user', () => {
  const user = ref<User>({
    id: '',
    address: '',
    nickname: '',
  })

  const getSession = async () => {
    const resp = await api.sessions.get()
    if (isSuccess(resp))
      user.value = resp.data
  }

  const login = async (message: string, sigHex: string, address: string) => {
    const resp = await api.sessions.create(message, sigHex, address)
    if (isSuccess(resp)) {
      user.value = resp.data
      return resp.code
    }

    return resp.code
  }

  const create = async (message: string, sigHex: string, address: string) => {
    const resp = await api.users.create(message, sigHex, address)
    if (isSuccess(resp))
      user.value = resp.data

    if (resp.code === 40901)
      throw new Error('User already exists')

    throw new Error('Unknown error')
  }

  const update = async (user: Partial<User>) => {
    const resp = await api.users.update(user)
    if (isSuccess(resp))
      user = resp.data

    if (resp.code === 40901)
      throw new Error('Nickname already exists')

    throw new Error('Unknown error')
  }

  const logout = async () => {
    await api.sessions.delete()
    user.value = {
      id: '',
      address: '',
      nickname: '',
    }
  }

  return {
    user,
    getSession,
    login,
    logout,
    create,
    update,
  }
})
