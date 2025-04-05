/* eslint-disable no-console */
import React, { createContext, useContext, useState, useEffect } from 'react'
import socketService from '../services/socketService'
import { MessageFactoryProvider } from '../factories/messageFactory'
import { chatObserver } from '../observers/chatObserver'
import { useSelector } from 'react-redux'

// Tạo context
const ChatContext = createContext()

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

export const ChatProvider = ({ children }) => {
  // Trạng thái chat
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [chatState, setChatState] = useState('closed') // closed, open, minimized
  const [messages, setMessages] = useState([])
  const [adminChatRooms, setAdminChatRooms] = useState([])
  const [activeChatRoom, setActiveChatRoom] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState({})
  const [unreadCount, setUnreadCount] = useState(0)

  // Lấy thông tin user từ Redux store (giả định)
  const user = useSelector((state) => state.auth?.user) || null
  const isAdmin = user?.role === 'admin'

  // Khởi tạo kết nối WebSocket khi component mount
  useEffect(() => {
    if (user && !isConnected && !isConnecting) {
      connectSocket()
    }

    return () => {
      // Cleanup khi component unmount
      socketService.disconnect()
    }
  }, [user])

  // Kết nối WebSocket
  const connectSocket = async () => {
    try {
      setIsConnecting(true)

      // Kết nối đến server
      socketService.connect(user?.id, isAdmin)

      // Đăng ký các event handlers
      socketService.on('connect', handleConnect)
      socketService.on('disconnect', handleDisconnect)
      socketService.on('message:received', handleMessageReceived)
      socketService.on('message:sent', handleMessageSent)
      socketService.on('user:typing', handleUserTyping)
      socketService.on('chat:admin-accepted', handleAdminAccepted)
      socketService.on('chat:admin-notified', handleAdminNotified)
      socketService.on('chat:history', handleChatHistory)

      // Nếu là admin, đăng ký thêm các event handlers cho admin
      if (isAdmin) {
        socketService.on('admin:user-online', handleUserOnline)
        socketService.on('admin:user-offline', handleUserOffline)
        socketService.on('admin:chat-request', handleChatRequest)
        socketService.on('admin:user-list', handleUserList)
      }

      setIsConnecting(false)
      setIsConnected(true)
    } catch (error) {
      console.error('Error connecting to socket:', error)
      setIsConnecting(false)
    }
  }

  // Xử lý sự kiện kết nối thành công
  const handleConnect = () => {
    console.log('Socket connected')
    setIsConnected(true)
  }

  // Xử lý sự kiện ngắt kết nối
  const handleDisconnect = () => {
    console.log('Socket disconnected')
    setIsConnected(false)
  }

  // Xử lý khi nhận được tin nhắn mới
  const handleMessageReceived = (messageData) => {
    const { from, to, message, type, timestamp, messageId } = messageData

    // Tạo object tin nhắn bằng Factory
    const factory = MessageFactoryProvider.getFactory(type)
    const newMessage = factory.createMessage(from, to, message, new Date(timestamp))
    newMessage.id = messageId
    newMessage.status = 'delivered'

    // Cập nhật state
    setMessages((prevMessages) => [...prevMessages, newMessage])

    // Tăng số lượng tin nhắn chưa đọc nếu chat đang ẩn
    if (chatState !== 'open') {
      setUnreadCount((prevCount) => prevCount + 1)
    }

    // Thông báo qua Observer
    chatObserver.notify('message:new', newMessage)
  }

  // Xử lý khi tin nhắn đã được gửi
  const handleMessageSent = (response) => {
    const { success, message } = response

    if (success && message) {
      // Cập nhật trạng thái tin nhắn
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === message.id ? { ...msg, status: 'sent' } : msg
        )
      )

      // Thông báo qua Observer
      chatObserver.notify('message:sent', message)
    }
  }

  // Xử lý khi có người đang gõ
  const handleUserTyping = (data) => {
    const { userId, isTyping } = data

    setTypingUsers((prevTypingUsers) => ({
      ...prevTypingUsers,
      [userId]: isTyping
    }))

    // Nếu là người dùng đang chat với admin
    if (!isAdmin && userId === activeChatRoom?.adminId) {
      setIsTyping(isTyping)
    }
  }

  // Xử lý khi admin chấp nhận chat
  const handleAdminAccepted = (data) => {
    const { adminId } = data

    // Cập nhật state
    setActiveChatRoom((prev) => ({
      ...prev,
      adminId,
      status: 'active'
    }))

    // Thông báo cho người dùng rằng admin đã tham gia
    const factory = MessageFactoryProvider.getFactory('system')
    const systemMessage = factory.createMessage(
      'system',
      user.id,
      'Admin đã tham gia cuộc trò chuyện',
      new Date()
    )

    setMessages((prevMessages) => [...prevMessages, systemMessage])

    // Thông báo qua Observer
    chatObserver.notify('chat:admin-joined', { adminId })
  }

  // Xử lý khi admin đã được thông báo
  const handleAdminNotified = (data) => {
    const { success, message } = data

    if (success) {
      // Hiển thị thông báo cho người dùng
      const factory = MessageFactoryProvider.getFactory('system')
      const systemMessage = factory.createMessage(
        'system',
        user.id,
        message || 'Yêu cầu chat đã được gửi đến admin',
        new Date()
      )

      setMessages((prevMessages) => [...prevMessages, systemMessage])
    }
  }

  // Xử lý khi nhận được lịch sử chat
  const handleChatHistory = (data) => {
    const { history } = data

    if (history && history.messages) {
      setMessages(history.messages)
      setActiveChatRoom((prev) => ({
        ...prev,
        roomId: history.roomId
      }))
    }
  }

  // Các hàm xử lý sự kiện cho admin
  const handleUserOnline = (data) => {
    if (!isAdmin) return

    const { userId, socketId } = data

    // Cập nhật danh sách phòng chat
    setAdminChatRooms((prevRooms) => {
      const existingRoomIndex = prevRooms.findIndex((room) => room.userId === userId)

      if (existingRoomIndex !== -1) {
        // Cập nhật phòng chat hiện có
        const updatedRooms = [...prevRooms]
        updatedRooms[existingRoomIndex] = {
          ...updatedRooms[existingRoomIndex],
          online: true,
          socketId
        }
        return updatedRooms
      } else {
        // Thêm phòng chat mới
        return [
          ...prevRooms,
          {
            userId,
            socketId,
            online: true,
            lastMessage: '',
            unreadCount: 0,
            status: 'pending'
          }
        ]
      }
    })

    // Thông báo qua Observer
    chatObserver.notify('admin:user-online', { userId, socketId })
  }

  const handleUserOffline = (data) => {
    if (!isAdmin) return

    const { userId } = data

    // Cập nhật danh sách phòng chat
    setAdminChatRooms((prevRooms) => {
      return prevRooms.map((room) =>
        room.userId === userId ? { ...room, online: false } : room
      )
    })

    // Thông báo qua Observer
    chatObserver.notify('admin:user-offline', { userId })
  }

  const handleChatRequest = (data) => {
    if (!isAdmin) return

    const { userId, socketId, timestamp } = data

    // Cập nhật danh sách phòng chat
    setAdminChatRooms((prevRooms) => {
      const existingRoomIndex = prevRooms.findIndex((room) => room.userId === userId)

      if (existingRoomIndex !== -1) {
        // Cập nhật phòng chat hiện có
        const updatedRooms = [...prevRooms]
        updatedRooms[existingRoomIndex] = {
          ...updatedRooms[existingRoomIndex],
          status: 'requested',
          requestTime: timestamp,
          unreadCount: updatedRooms[existingRoomIndex].unreadCount + 1
        }
        return updatedRooms
      } else {
        // Thêm phòng chat mới
        return [
          ...prevRooms,
          {
            userId,
            socketId,
            online: true,
            lastMessage: '',
            unreadCount: 1,
            status: 'requested',
            requestTime: timestamp
          }
        ]
      }
    })

    // Thông báo qua Observer
    chatObserver.notify('admin:chat-request', { userId, socketId, timestamp })
  }

  const handleUserList = (data) => {
    if (!isAdmin) return

    // Cập nhật danh sách phòng chat
    setAdminChatRooms(
      data.map((user) => ({
        userId: user.userId,
        socketId: user.socketId,
        online: true,
        lastMessage: '',
        unreadCount: 0,
        status: 'pending'
      }))
    )

    // Thông báo qua Observer
    chatObserver.notify('admin:user-list', data)
  }

  // Gửi tin nhắn
  const sendMessage = (content, type = 'text', metadata = {}) => {
    if (!isConnected) {
      console.error('Socket is not connected. Unable to send message.')
      return false
    }

    if (!activeChatRoom) {
      console.error('No active chat room. Unable to send message.')
      return false
    }

    const to = isAdmin ? activeChatRoom.userId : activeChatRoom.adminId

    // Tạo tin nhắn sử dụng Factory
    const factory = MessageFactoryProvider.getFactory(type)
    const message = factory.createMessage(user.id, to, content, new Date(), metadata)

    // Thêm tin nhắn vào state (với trạng thái 'sending')
    setMessages((prevMessages) => [...prevMessages, message])

    // Gửi tin nhắn qua socket
    socketService.sendMessage(to, content, type, metadata)

    return true
  }

  // Bắt đầu cuộc trò chuyện với admin
  const startChatWithAdmin = () => {
    if (!isConnected) {
      console.error('Socket is not connected. Unable to start chat.')
      return false
    }

    if (isAdmin) {
      console.error('Admin cannot start a chat with admin.')
      return false
    }

    // Thiết lập phòng chat
    setActiveChatRoom({
      userId: user.id,
      adminId: null, // Sẽ được cập nhật khi admin chấp nhận
      status: 'pending'
    })

    // Mở khung chat
    setChatState('open')
    setUnreadCount(0)

    // Thông báo cho admin
    socketService.startChatWithAdmin()

    return true
  }

  // Admin chấp nhận chat với người dùng
  const acceptChat = (userId) => {
    if (!isConnected || !isAdmin) {
      console.error('Not authorized or not connected. Unable to accept chat.')
      return false
    }

    // Cập nhật phòng chat hiện tại
    setActiveChatRoom({
      userId,
      adminId: user.id,
      status: 'active'
    })

    // Mở khung chat
    setChatState('open')
    setUnreadCount(0)

    // Thông báo cho user
    socketService.emit('admin:accept-chat', { userId })

    // Cập nhật danh sách phòng chat
    setAdminChatRooms((prevRooms) => {
      return prevRooms.map((room) =>
        room.userId === userId
          ? { ...room, status: 'active', unreadCount: 0 }
          : room
      )
    })

    return true
  }

  // Mở khung chat
  const openChat = () => {
    setChatState('open')
    setUnreadCount(0)
  }

  // Thu gọn khung chat
  const minimizeChat = () => {
    setChatState('minimized')
  }

  // Đóng khung chat
  const closeChat = () => {
    setChatState('closed')
    setMessages([])
    setActiveChatRoom(null)
  }

  // Đánh dấu người dùng đang gõ
  const setTypingStatus = (isTyping) => {
    if (!isConnected || !activeChatRoom) return

    const to = isAdmin ? activeChatRoom.userId : activeChatRoom.adminId
    socketService.sendTypingStatus(to, isTyping)
  }

  // Đóng phòng chat (chỉ admin)
  const closeChatRoom = () => {
    if (!isAdmin || !activeChatRoom) return

    // Gửi yêu cầu đóng phòng chat
    socketService.emit('admin:close-chat', { userId: activeChatRoom.userId })

    // Thêm tin nhắn hệ thống
    const factory = MessageFactoryProvider.getFactory('system')
    const systemMessage = factory.createMessage(
      'system',
      activeChatRoom.userId,
      'Cuộc trò chuyện đã kết thúc',
      new Date()
    )

    setMessages((prevMessages) => [...prevMessages, systemMessage])

    // Cập nhật trạng thái
    setActiveChatRoom((prev) => ({ ...prev, status: 'closed' }))

    // Cập nhật danh sách phòng chat
    setAdminChatRooms((prevRooms) => {
      return prevRooms.map((room) =>
        room.userId === activeChatRoom.userId
          ? { ...room, status: 'closed' }
          : room
      )
    })
  }

  // Context value
  const value = {
    isConnected,
    isConnecting,
    chatState,
    messages,
    adminChatRooms,
    activeChatRoom,
    isTyping,
    unreadCount,
    isAdmin,
    startChatWithAdmin,
    acceptChat,
    sendMessage,
    openChat,
    minimizeChat,
    closeChat,
    setTypingStatus,
    closeChatRoom
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}