/**
 * Custom hook để sử dụng ChatContext và thêm các chức năng bổ sung
 */
import { useEffect, useState, useRef, useCallback } from 'react'
import { useChatContext } from '~/contexts/ChatContext'
import { useSelector } from 'react-redux'

export const useChat = () => {
  const chatContext = useChatContext()
  const {
    messages,
    sendMessage,
    isTyping,
    setTypingStatus,
    isAdmin,
    activeChatRoom,
    acceptChat,
    unreadCount
  } = chatContext

  const user = useSelector((state) => state.auth?.user) || null
  const [inputValue, setInputValue] = useState('')
  const [typingTimeout, setTypingTimeout] = useState(null)
  const messagesEndRef = useRef(null)

  // Cuộn xuống cuối danh sách tin nhắn
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  // Cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    setInputValue(e.target.value)

    // Thông báo đang gõ
    if (!typingTimeout) {
      setTypingStatus(true)
    }

    // Đặt timeout để thông báo dừng gõ
    clearTimeout(typingTimeout)
    setTypingTimeout(
      setTimeout(() => {
        setTypingStatus(false)
        setTypingTimeout(null)
      }, 1000)
    )
  }

  // Gửi tin nhắn
  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    sendMessage(inputValue.trim())
    setInputValue('')
    setTypingStatus(false)
    clearTimeout(typingTimeout)
    setTypingTimeout(null)
  }

  // Gửi tin nhắn khi nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Gửi tin nhắn hình ảnh
  const handleSendImage = (file) => {
    // Trong thực tế, bạn cần tải lên hình ảnh lên server
    // Ở đây chúng ta sẽ giả định một URL
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target.result
      sendMessage(imageUrl, 'image', {
        width: 'auto',
        height: 'auto',
        alt: file.name
      })
    }
    reader.readAsDataURL(file)
  }

  // Gửi tin nhắn file
  const handleSendFile = (file) => {
    // Trong thực tế, bạn cần tải lên file lên server
    // Ở đây chúng ta sẽ giả định một URL
    sendMessage(URL.createObjectURL(file), 'file', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    })
  }

  // Hàm tiện ích để định dạng thời gian
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Kiểm tra tin nhắn có phải của người dùng hiện tại không
  const isCurrentUser = (senderId) => {
    return user?.id === senderId
  }

  // Nhóm tin nhắn theo người gửi để hiển thị avatar đúng
  const groupMessagesBySender = () => {
    const groups = []
    let currentGroup = null

    for (const message of messages) {
      // Bỏ qua tin nhắn hệ thống
      if (message.sender === 'system') {
        groups.push({
          id: message.id,
          sender: 'system',
          messages: [message]
        })
        currentGroup = null
        continue
      }

      if (!currentGroup || currentGroup.sender !== message.sender) {
        currentGroup = {
          id: message.id,
          sender: message.sender,
          messages: [message]
        }
        groups.push(currentGroup)
      } else {
        currentGroup.messages.push(message)
      }
    }

    return groups
  }

  // Hook để admin nhận chat mới
  const adminAcceptNewChat = useCallback(
    (userId) => {
      if (isAdmin) {
        acceptChat(userId)
      }
    },
    [isAdmin, acceptChat]
  )

  return {
    messages,
    inputValue,
    isTyping,
    unreadCount,
    isAdmin,
    activeChatRoom,
    messagesEndRef,
    groupMessagesBySender,
    formatMessageTime,
    isCurrentUser,
    handleInputChange,
    handleSendMessage,
    handleKeyPress,
    handleSendImage,
    handleSendFile,
    adminAcceptNewChat
  }
}