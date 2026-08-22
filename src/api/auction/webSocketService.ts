import { Client } from '@stomp/stompjs'
import type { StompSubscription } from '@stomp/stompjs'

class WebSocketService {
  private client: Client | null = null
  private isConnected = false

  public connect(brokerUrl: string, onConnectCallback?: () => void): void {
    // FIX: if already connected, call callback immediately instead of returning silently
    if (this.client && this.isConnected) {
      onConnectCallback?.()
      return
    }

    this.client = new Client({
      brokerURL: brokerUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.isConnected = true
        onConnectCallback?.()
      },
      onDisconnect: () => {
        this.isConnected = false
      },
      onStompError: (frame) => {
        console.error('STOMP Error:', frame.headers['message'], frame.body)
      },
    })

    this.client.activate()
  }

  public subscribe(
    destination: string,
    callback: (messageBody: any) => void
  ): StompSubscription | null {
    if (!this.client || !this.isConnected) {
      console.warn('STOMP client not connected')
      return null
    }
    return this.client.subscribe(destination, (message) => {
      try {
        const payload = JSON.parse(message.body)
        callback(payload)
      } catch (err) {
        console.error('Failed to parse WS payload', err)
      }
    })
  }

  // FIX: was missing entirely
  public publish(destination: string, body: unknown): void {
    if (!this.client || !this.isConnected) {
      console.warn('STOMP client not connected, cannot publish')
      return
    }
    this.client.publish({
      destination,
      body: JSON.stringify(body),
    })
  }

  public disconnect(): void {
    if (this.client) {
      this.client.deactivate()
      this.client = null
      this.isConnected = false
    }
  }
}

export const wsService = new WebSocketService()