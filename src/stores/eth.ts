// eslint-disable-next-line unicorn/prefer-node-protocol
import { Buffer } from 'buffer'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEth = defineStore('eth', () => {
  const userAddr = ref('')

  const connectWallet = async () => {
    const p = window.ethereum
    if (!p)
      throw new Error('No ethereum provider found')

    const accounts = await p.send('eth_requestAccounts', [])
    userAddr.value = accounts.result[0]
  }

  const signMessage = async (msg: string): Promise<string> => {
    const p = window.ethereum
    if (!p)
      throw new Error('No ethereum provider found')

    return (await p.send('personal_sign', [`0x${Buffer.from(msg).toString('hex')}`, userAddr.value])).result
  }

  return {
    connectWallet,
    signMessage,
    userAddr,
  }
})
