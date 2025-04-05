import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Paper,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  InputAdornment
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import MinimizeIcon from '@mui/icons-material/Remove'
import SendIcon from '@mui/icons-material/Send'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ImageIcon from '@mui/icons-material/Image'
import { useChatContext } from '~/contexts/ChatContext'
import { useChat } from '../../hook/useChat'
import ChatMessage from './ChatMessage'

const ChatPanel = () => {
  const {
    chatState,
    minimizeChat,
    closeChat,
    startChatWithAdmin,
    isConnected,
    activeChatRoom
  } = useChatContext()

  const {
    messages,
    inputValue,
    isTyping,
    messagesEndRef,
    groupMessagesBySender,
    handleInputChange,
    handleSendMessage,
    handleKeyPress,
    handleSendImage,
    handleSendFile
  } = useChat()

  // Nếu trạng thái là minimized, chỉ hiển thị header
  const isMinimized = chatState === 'minimized'

  // Bắt đầu chat với admin nếu chưa có phòng chat
  useEffect(() => {
    if (isConnected && chatState === 'open' && !activeChatRoom) {
      startChatWithAdmin()
    }
  }, [isConnected, chatState, activeChatRoom, startChatWithAdmin])

  // Xử lý upload hình ảnh
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      handleSendImage(file)
    }
    e.target.value = ''
  }

  // Xử lý upload file
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleSendFile(file)
    }
    e.target.value = ''
  }

  // Animation cho khung chat
  const panelVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  }

  // Nhóm tin nhắn theo người gửi
  const messageGroups = groupMessagesBySender()

  return (
    <motion.div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        width: '350px'
      }}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={panelVariants}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: '10px',
          overflow: 'hidden',
          height: isMinimized ? 'auto' : '500px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: '#1cb05c',
            color: 'white',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{ width: 32, height: 32, marginRight: 1, bgcolor: '#fff' }}
              alt="Hỗ trợ viên"
              src="/support-agent.png"
            >
              <Typography variant="body1" sx={{ color: '#1cb05c', fontWeight: 'bold' }}>
                ?
              </Typography>
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Hỗ trợ khách hàng
            </Typography>
          </Box>
          <Box>
            <IconButton
              size="small"
              onClick={minimizeChat}
              sx={{ color: 'white', marginRight: 1 }}
            >
              <MinimizeIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={closeChat} sx={{ color: 'white' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {!isMinimized && (
          <>
            {/* Chat Messages */}
            <Box
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                padding: 2,
                backgroundColor: '#f5f5f5',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {!activeChatRoom ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    textAlign: 'center',
                    gap: 2
                  }}
                >
                  <Typography variant="h6">Kết nối với hỗ trợ viên</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nhấn nút bên dưới để bắt đầu cuộc trò chuyện với hỗ trợ viên của chúng tôi.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={startChatWithAdmin}
                    sx={{
                      backgroundColor: '#1cb05c',
                      '&:hover': { backgroundColor: '#169c4f' }
                    }}
                    disabled={!isConnected}
                  >
                    {isConnected ? 'Bắt đầu trò chuyện' : <CircularProgress size={24} color="inherit" />}
                  </Button>
                </Box>
              ) : (
                <>
                  {messageGroups.map((group) => (
                    <ChatMessage key={group.id} messageGroup={group} />
                  ))}
                  {isTyping && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 1,
                        alignSelf: 'flex-start'
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Hỗ trợ viên đang nhập...
                      </Typography>
                    </Box>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </Box>

            {/* Input Area - Hiển thị với bất kỳ trạng thái nào của activeChatRoom */}
            {activeChatRoom && (
              <>
                <Divider />
                <Box sx={{ padding: 2, backgroundColor: '#fff' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Nhập tin nhắn..."
                    size="small"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <input
                            type="file"
                            accept="image/*"
                            id="image-upload"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                          />
                          <label htmlFor="image-upload">
                            <IconButton component="span" size="small" sx={{ color: '#1cb05c' }}>
                              <ImageIcon fontSize="small" />
                            </IconButton>
                          </label>

                          <input
                            type="file"
                            id="file-upload"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                          />
                          <label htmlFor="file-upload">
                            <IconButton component="span" size="small" sx={{ color: '#1cb05c' }}>
                              <AttachFileIcon fontSize="small" />
                            </IconButton>
                          </label>

                          <IconButton
                            size="small"
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                            sx={{
                              backgroundColor: inputValue.trim() ? '#1cb05c' : 'grey.300',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: inputValue.trim() ? '#169c4f' : 'grey.300'
                              }
                            }}
                          >
                            <SendIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                        '& fieldset': {
                          borderColor: '#e0e0e0'
                        },
                        '&:hover fieldset': {
                          borderColor: '#1cb05c'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1cb05c'
                        }
                      }
                    }}
                  />
                </Box>
              </>
            )}
          </>
        )}
      </Paper>
    </motion.div>
  )
}

export default ChatPanel