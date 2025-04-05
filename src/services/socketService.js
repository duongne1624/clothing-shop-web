/* eslint-disable no-console */
/**
 * Socket Service (Singleton Pattern)
 * Quản lý kết nối WebSocket giữa client và server
 */
import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    // Singleton check
    if (SocketService.instance) {
      return SocketService.instance
    }

    this.socket = null
    this.connected = false
    this.listeners = new Map()
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5

    SocketService.instance = this
  }

  /**
   * Kết nối đến server socket
   */
  connect(userId = null, isAdmin = false) {
    if (this.socket && this.connected) {
      return this.socket
    }

    const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8017'

    this.socket = io(serverUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
      withCredentials: true
    })

    // Xử lý sự kiện kết nối
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id)
      this.connected = true
      this.reconnectAttempts = 0

      // Nếu có userId, thực hiện đăng nhập
      if (userId) {
        this.login(userId, isAdmin)
      }
    })

    // Xử lý sự kiện ngắt kết nối
    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      this.connected = false
    })

    // Xử lý lỗi
    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      this.reconnectAttempts++

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Maximum reconnection attempts reached. Giving up.')
        this.socket.disconnect()
      }
    })

    return this.socket
  }

  /**
   * Đăng nhập vào socket
   */
  login(userId, isAdmin = false) {
    if (!this.socket || !this.connected) {
      console.error('Socket is not connected. Unable to login.')
      return false
    }

    this.socket.emit('user:login', { userId, isAdmin })
    console.log(`Socket login: ${userId}, isAdmin: ${isAdmin}`)
    return true
  }

  /**
   * Đăng ký lắng nghe sự kiện
   */
  on(event, callback) {
    if (!this.socket) {
      console.error('Socket is not initialized. Unable to listen to events.')
      return () => {} // Return empty unsubscribe function
    }

    // Lưu callback vào Map để có thể unsubscribe sau này
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    this.listeners.get(event).add(callback)

    // Đăng ký với socket.io
    this.socket.on(event, callback)

    // Trả về hàm unsubscribe
    return () => this.off(event, callback)
  }

  /**
   * Hủy đăng ký lắng nghe sự kiện
   */
  off(event, callback) {
    if (!this.socket) return false

    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)

      if (callback) {
        // Hủy đăng ký một callback cụ thể
        callbacks.delete(callback)
        this.socket.off(event, callback)
      } else {
        // Hủy đăng ký tất cả callbacks cho event này
        callbacks.clear()
        this.socket.off(event)
      }

      return true
    }

    return false
  }

  /**
   * Gửi sự kiện
   */
  emit(event, data, callback) {
    if (!this.socket || !this.connected) {
      console.error('Socket is not connected. Unable to emit event.')
      return false
    }

    this.socket.emit(event, data, callback)
    return true
  }

  /**
   * Bắt đầu cuộc trò chuyện với admin
   */
  startChatWithAdmin() {
    return this.emit('chat:start-with-admin')
  }

  /**
   * Gửi tin nhắn
   */
  sendMessage(to, message, type = 'text', metadata = {}) {
    return this.emit('message:send', { to, message, type, metadata })
  }

  /**
   * Thông báo đang gõ
   */
  sendTypingStatus(to, isTyping) {
    return this.emit('user:typing', { to, isTyping })
  }

  /**
   * Ngắt kết nối socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.connected = false
      this.listeners.clear()
    }
  }

  /**
   * Kiểm tra trạng thái kết nối
   */
  isConnected() {
    return this.connected
  }
}

// Export singleton instance
const socketService = new SocketService()
export default socketService