import type { User } from '~/api/types'

export interface HallMessage {
  message: string
  from: User
}
