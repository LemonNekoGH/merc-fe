import type { NormalChatMessage } from './common'
import type { User } from '~/api/types'

// other side exited
interface ExitChatCommand {
  type: 'exit'
}

// single chat
export type ChatMessage = NormalChatMessage | ExitChatCommand

export function isExitCommand(msg: ChatMessage): msg is ExitChatCommand {
  return msg.type === 'exit'
}

// request in hall
interface RequestChatMessage {
  type: 'request'
  from: User
  message: string
  id: number
}

interface RequestIDMessage {
  type: 'request_id'
  id: number
}

// accept in hall
interface AcceptChatMessage {
  type: 'accept'
  id: number
}

// reject in hall
interface RejectChatMessage {
  type: 'reject'
  reason: 'Target has a pending request'
  | 'Target is chatting with others'
  | 'Your request has been rejected'
  | 'This request was expired'
  | 'You can\'t send request when you are chatting'
  | 'This request was canceled'
}

export type NotificationMessage = AcceptChatMessage | RejectChatMessage | RequestChatMessage | RequestIDMessage
