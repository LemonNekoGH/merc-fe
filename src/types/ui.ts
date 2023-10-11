import type { User } from '~/api/types'

export interface ChatRequestDialogProps {
  from: User
  to: User
  type: 'incoming' | 'outcome'
  message: string
  error: string
  sent: boolean
  example?: boolean
}
