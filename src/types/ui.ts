export interface ChatRequestDialogProps {
  avatar: string
  name: string
  type: 'incoming' | 'outcome'
  message: string
  error: string
  sent: boolean
  example?: boolean
}
