/* eslint-disable no-console */
/**
 * Observer Pattern cho hệ thống Chat (Frontend)
 */

// Subject (Observable)
class ChatSubject {
  constructor() {
    this.observers = new Map() // event -> [callbacks]
  }

  subscribe(event, observer) {
    if (!this.observers.has(event)) {
      this.observers.set(event, [])
    }

    this.observers.get(event).push(observer)

    // Trả về hàm unsubscribe
    return () => {
      const observers = this.observers.get(event)
      if (observers) {
        const index = observers.indexOf(observer)
        if (index !== -1) {
          observers.splice(index, 1)
        }
      }
    }
  }

  unsubscribe(event, observer) {
    if (!this.observers.has(event)) return false

    const observers = this.observers.get(event)
    const index = observers.indexOf(observer)

    if (index !== -1) {
      observers.splice(index, 1)
      return true
    }

    return false
  }

  notify(event, data) {
    if (!this.observers.has(event)) return

    for (const observer of this.observers.get(event)) {
      observer(data)
    }
  }
}

// Singleton instance
const chatObserver = new ChatSubject()

// Các loại observer cụ thể
class MessageObserver {
  constructor() {
    this.unsubscribers = []

    // Đăng ký các hàm xử lý cho các sự kiện
    this.unsubscribers.push(
      chatObserver.subscribe('message:new', this.handleNewMessage.bind(this)),
      chatObserver.subscribe('message:sent', this.handleMessageSent.bind(this)),
      chatObserver.subscribe('message:delivered', this.handleMessageDelivered.bind(this)),
      chatObserver.subscribe('message:read', this.handleMessageRead.bind(this)),
      chatObserver.subscribe('message:failed', this.handleMessageFailed.bind(this))
    )
  }

  handleNewMessage(message) {
    console.log('New message received:', message)
  }

  handleMessageSent(message) {
    console.log('Message sent:', message)
  }

  handleMessageDelivered(message) {
    console.log('Message delivered:', message)
  }

  handleMessageRead(message) {
    console.log('Message read:', message)
  }

  handleMessageFailed(message) {
    console.log('Message failed:', message)
  }

  // Cleanup method
  cleanup() {
    this.unsubscribers.forEach(unsubscribe => unsubscribe())
    this.unsubscribers = []
  }
}

class ChatNotificationObserver {
  constructor() {
    this.unsubscribers = []

    // Đăng ký các hàm xử lý cho các sự kiện
    this.unsubscribers.push(
      chatObserver.subscribe('notification:new-message', this.handleNewMessageNotification.bind(this)),
      chatObserver.subscribe('notification:chat-request', this.handleChatRequestNotification.bind(this)),
      chatObserver.subscribe('notification:chat-closed', this.handleChatClosedNotification.bind(this))
    )
  }

  handleNewMessageNotification(data) {
    console.log('New message notification:', data)

    // Ở đây có thể hiển thị thông báo cho người dùng
    // Ví dụ: sử dụng browser notifications API
    if (Notification.permission === 'granted') {
      new Notification('Tin nhắn mới', {
        body: `${data.from}: ${data.preview}`,
        icon: '/path/to/icon.png'
      })
    }
  }

  handleChatRequestNotification(data) {
    console.log('Chat request notification:', data)
  }

  handleChatClosedNotification(data) {
    console.log('Chat closed notification:', data)
  }

  // Cleanup method
  cleanup() {
    this.unsubscribers.forEach(unsubscribe => unsubscribe())
    this.unsubscribers = []
  }
}

class AdminChatObserver {
  constructor() {
    this.unsubscribers = []

    // Đăng ký các hàm xử lý cho các sự kiện liên quan đến admin
    this.unsubscribers.push(
      chatObserver.subscribe('admin:user-online', this.handleUserOnline.bind(this)),
      chatObserver.subscribe('admin:user-offline', this.handleUserOffline.bind(this)),
      chatObserver.subscribe('admin:chat-request', this.handleChatRequest.bind(this)),
      chatObserver.subscribe('admin:user-list', this.handleUserList.bind(this))
    )
  }

  handleUserOnline(data) {
    console.log('User online:', data)
  }

  handleUserOffline(data) {
    console.log('User offline:', data)
  }

  handleChatRequest(data) {
    console.log('Chat request:', data)
  }

  handleUserList(data) {
    console.log('User list:', data)
  }

  // Cleanup method
  cleanup() {
    this.unsubscribers.forEach(unsubscribe => unsubscribe())
    this.unsubscribers = []
  }
}

export {
  chatObserver,
  MessageObserver,
  ChatNotificationObserver,
  AdminChatObserver
}