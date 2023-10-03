import { RestfulClient } from '../restful'
import type { User } from './types'

const client = new RestfulClient(import.meta.env.VITE_APP_API_BASE_URL)

export const api = {
  users: {
    async create(message: string, signHex: string, address: string) {
      return client.post<User>('/users', { user: { message, sign_hex: signHex, address } })
    },
    async update(param: Partial<User>) {
      return client.patch<User>(`/users/${param.id}`, param)
    },
    async getMessage() {
      return client.get<string>('/users/message_for_signup')
    },
  },
  sessions: {
    async get() {
      return client.get<User>('/sessions')
    },
    async create(message: string, signHex: string, address: string) {
      return client.post<User>('/sessions', { user: { message, sign_hex: signHex, address } })
    },
    async delete() {
      return client.post<null>('/sessions')
    },
    async getMessage() {
      return client.get<string>('/sessions/message_for_login')
    },
  },
}
