import type { Consumer, Mixin, Subscription } from '@rails/actioncable'
import { createConsumer } from '@rails/actioncable'
import { defineStore } from 'pinia'
import type { User } from '~/api/types'
import type { Common, Received, Send } from '~/types/chat'

export const useCable = defineStore('cable', () => {
  const consumer = createConsumer()

  let notification: (Subscription<Consumer> & Mixin & {
    received: (data: Received.NotificationMessage) => void
  }) | null = null
  const createNotificationChannel = (address: string, onReceived: (msg: Received.NotificationMessage) => void) => {
    notification = consumer.subscriptions.create({
      channel: 'NotificationChannel',
      address,
    }, {
      received: onReceived,
    })
  }
  const acceptChatRequest = (request: number) => {
    notification!.send({ type: 'accept', request } as Send.AcceptChatMessage)
  }
  const rejectChatRequest = (request: number) => {
    notification!.send({ type: 'reject', request } as Send.RejectChatMessage)
  }
  const cancelChatRequest = (request: number) => {
    notification!.send({ type: 'cancel', request } as Send.CancelChatMessage)
  }

  let hall: (Subscription<Consumer> & Mixin & {
    received: (data: Common.HallMessage | Common.HallMessage[]) => void
  }) | null = null
  const createHallChannel = (receiver: (data: Common.HallMessage | Common.HallMessage[]) => void) => {
    hall = consumer.subscriptions.create({
      channel: 'HallChannel',
    }, {
      received: receiver,
    })
  }
  const sendToHall = (msg: string, user: User) => {
    hall!.send({ message: msg, from: user } as Common.HallMessage)
  }
  const requestChatFromHall = (from: string, to: string, message: string) => {
    notification!.send({ type: 'request', from, to, timestamp: Date.now(), message } as Send.RequestChatMessage)
  }

  let chat: (Subscription<Consumer> & Mixin & {
    received: (data: Received.ChatMessage) => void
  }) | null = null
  const enterChat = (id: number, receiver: (data: Received.ChatMessage) => void) => {
    chat = consumer.subscriptions.create({
      channel: 'ChatChannel',
      id,
    }, {
      received: receiver,
    })
  }
  const sendToChat = (msg: string, userAddr: string) => {
    chat!.send({ type: 'normal', message: msg, from: userAddr, timestamp: Date.now() } as Common.NormalChatMessage)
  }
  const exitChat = (from: string) => chat!.send({ type: 'exit', from } as Send.ExitChatCommand)

  return {
    createNotificationChannel,
    acceptChatRequest,
    rejectChatRequest,
    sendToHall,
    createHallChannel,
    requestChatFromHall,
    cancelChatRequest,
    enterChat,
    sendToChat,
    exitChat,
  }
})
