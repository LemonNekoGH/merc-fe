import type { Consumer, Mixin, Subscription } from '@rails/actioncable'
import { createConsumer } from '@rails/actioncable'
import { defineStore } from 'pinia'
import type { User } from '~/api/types'
import type { Common, Received, Send } from '~/types/chat'

export const useCable = defineStore('cable', () => {
  const consumer = createConsumer()

  let notification: (Subscription<Consumer> & Mixin & {
    received: (data: Received.AcceptOrRejectChatMessage) => void
  }) | null = null
  const createNotificationChannel = (address: string, onReceived: (_: Received.AcceptOrRejectChatMessage) => void) => {
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

  let hallMessageReceiver = (_: Common.HallMessage | Common.HallMessage[]) => {}
  const hall = consumer.subscriptions.create({
    channel: 'ChatHallChannel',
    room: 'hall',
  }, {
    received: hallMessageReceiver,
  })
  const setHallMessageReceiver = (receiver: (data: Common.HallMessage | Common.HallMessage[]) => void) => {
    hallMessageReceiver = receiver
  }
  const sendToHall = (msg: string, user: User) => {
    hall.send({ message: msg, from: user } as Common.HallMessage)
  }
  const requestChatFromHall = (from: User, to: User) => {
    notification!.send({ type: 'request', from, to, timestamp: Date.now() } as Send.RequestChatMessage)
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
    setHallMessageReceiver,
    requestChatFromHall,
    enterChat,
    sendToChat,
    exitChat,
  }
})
