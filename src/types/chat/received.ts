import type { User } from '~/api/types'

// other side exited
interface ExitChatCommand {
  type: 'exit'
}

export interface NormalChatMessage {
  type: 'normal'
  message: string
  from: string
  lucky_point: number
}

export interface ChatInfo {
  type: 'info'
  messages: NormalChatMessage[]
  end: boolean
  end_by: string
  from: User
  to: User
}

// single chat
export type ChatMessage = NormalChatMessage | ChatInfo | ExitChatCommand

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
  | 'This request has been expired'
  | 'You can\'t send request when you are chatting'
  | 'This request has been canceled'
}

export type NotificationMessage = AcceptChatMessage | RejectChatMessage | RequestChatMessage | RequestIDMessage
