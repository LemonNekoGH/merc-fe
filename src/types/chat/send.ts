// request in hall
export interface RequestChatMessage {
  type: 'request'
  from: string
  to: string
  message: string
}

// cancel request
export interface CancelRequestMessage {
  type: 'cancel'
  from: string // address
  to: string // address
}

// accept chat
export interface AcceptChatMessage {
  type: 'accept'
  request: number // message id
}

// reject chat
export interface RejectChatMessage {
  type: 'reject'
  request: number // message id
}

// cancel request
export interface CancelChatMessage {
  type: 'cancel'
  request: number // message id
}

// exit chat
export interface ExitChatCommand {
  type: 'exit'
  from: string // address
}
