import type { User } from '~/api/types'

export interface ChatRequestDialogProps {
  from?: User
  to?: User
  message: string
  error: string
  example?: boolean
  id: number
}
