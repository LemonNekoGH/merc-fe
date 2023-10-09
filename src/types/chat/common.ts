import type { User } from '~/api/types'

export interface HallMessage {
  message: string
  from: User
}

export interface NormalChatMessage {
  type: 'normal'
  message: string
  from: string // address
}
