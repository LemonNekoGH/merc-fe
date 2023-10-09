export interface ChatRequestDialogProps {
  avatar: string
  name: string
  type: 'incoming' | 'outcome'
  message: string
  error: 'She/he has a pending chat request' | 'Sha/he is chatting with others' | 'She/he rejected your request' | 'You are chatting with others' | ''
  sent: boolean
  example?: boolean
}
