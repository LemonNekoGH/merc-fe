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
export interface RequestChatMessage {
  type: 'request'
  from: User
  to: User
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
  reason: 'pending' | 'other_side_chatting' | 'user_reject' | 'expired' | 'you_are_chatting'
}

export type AcceptOrRejectChatMessage = AcceptChatMessage | RejectChatMessage

export function isAccept(msg: AcceptOrRejectChatMessage): msg is AcceptChatMessage {
  return msg.type === 'accept'
}
