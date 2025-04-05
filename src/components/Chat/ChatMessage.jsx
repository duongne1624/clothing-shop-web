import React from 'react'
import { Box, Typography, Avatar, Paper, Tooltip } from '@mui/material'
import { useSelector } from 'react-redux'
import { useChat } from '../../hook/useChat'
import DoneIcon from '@mui/icons-material/Done'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

const ChatMessage = ({ messageGroup }) => {
  const { sender, messages } = messageGroup
  const { formatMessageTime, isCurrentUser } = useChat()
  const user = useSelector((state) => state.auth?.user) || null

  const isSystem = sender === 'system'
  const isMe = isCurrentUser(sender)

  // Nếu là tin nhắn hệ thống, hiển thị một thiết kế khác
  if (isSystem) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          my: 1,
          px: 2
        }}
      >
        <Typography
          variant="caption"
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            color: 'text.secondary',
            borderRadius: '10px',
            py: 0.5,
            px: 2
          }}
        >
          {messages[0].content}
        </Typography>
      </Box>
    )
  }

  // Xác định tên hiển thị
  const displayName = isMe ? 'Bạn' : 'Hỗ trợ viên'

  // Hiển thị avatar dựa trên người gửi
  const avatarUrl = isMe ? user?.avatar : '/support-agent.png'
  const avatarLetter = isMe ? user?.name?.charAt(0) || 'U' : 'A'

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMe ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        marginBottom: 2
      }}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: isMe ? '#1cb05c' : '#2196f3',
          marginRight: isMe ? 0 : 1,
          marginLeft: isMe ? 1 : 0
        }}
        src={avatarUrl}
      >
        {avatarLetter}
      </Avatar>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMe ? 'flex-end' : 'flex-start',
          maxWidth: '70%'
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {displayName}
        </Typography>

        {messages.map((message, index) => (
          <MessageContent
            key={message.id || index}
            message={message}
            isMe={isMe}
            isLast={index === messages.length - 1}
          />
        ))}
      </Box>
    </Box>
  )
}

// Component hiển thị nội dung tin nhắn dựa vào loại
const MessageContent = ({ message, isMe, isLast }) => {
  const { formatMessageTime } = useChat()

  // Xác định icon trạng thái tin nhắn
  const getStatusIcon = () => {
    switch (message.status) {
    case 'sending':
      return null
    case 'sent':
      return <DoneIcon fontSize="small" sx={{ fontSize: 14, ml: 0.5 }} />
    case 'delivered':
      return <DoneAllIcon fontSize="small" sx={{ fontSize: 14, ml: 0.5 }} />
    case 'read':
      return <DoneAllIcon fontSize="small" sx={{ fontSize: 14, ml: 0.5, color: '#1976d2' }} />
    case 'failed':
      return <ErrorOutlineIcon fontSize="small" sx={{ fontSize: 14, ml: 0.5, color: 'error.main' }} />
    default:
      return null
    }
  }

  // Hiển thị nội dung dựa vào loại tin nhắn
  switch (message.type) {
  case 'text':
    return (
      <Box sx={{ position: 'relative', mt: 0.5 }}>
        <Paper
          sx={{
            p: 1,
            borderRadius: 2,
            backgroundColor: isMe ? '#e3f2fd' : 'white',
            wordBreak: 'break-word'
          }}
        >
          <Typography variant="body2">{message.content}</Typography>
        </Paper>

        {isLast && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isMe ? 'flex-end' : 'flex-start',
              mt: 0.5
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {formatMessageTime(message.timestamp)}
            </Typography>
            {isMe && getStatusIcon()}
          </Box>
        )}
      </Box>
    )

  case 'image':
    return (
      <Box sx={{ position: 'relative', mt: 0.5 }}>
        <Paper
          sx={{
            p: 1,
            borderRadius: 2,
            backgroundColor: isMe ? '#e3f2fd' : 'white',
            maxWidth: '200px'
          }}
        >
          <Box
            component="img"
            src={message.content}
            alt={message.metadata?.alt || 'Hình ảnh'}
            sx={{
              width: '100%',
              borderRadius: 1,
              cursor: 'pointer'
            }}
          />
        </Paper>

        {isLast && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isMe ? 'flex-end' : 'flex-start',
              mt: 0.5
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {formatMessageTime(message.timestamp)}
            </Typography>
            {isMe && getStatusIcon()}
          </Box>
        )}
      </Box>
    )

  case 'file':
    return (
      <Box sx={{ position: 'relative', mt: 0.5 }}>
        <Paper
          sx={{
            p: 1,
            borderRadius: 2,
            backgroundColor: isMe ? '#e3f2fd' : 'white'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box
              component="a"
              href={message.content}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'primary.main'
              }}
            >
              <Typography variant="body2">
                {message.metadata?.fileName || 'Tệp tin'}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {isLast && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isMe ? 'flex-end' : 'flex-start',
              mt: 0.5
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {formatMessageTime(message.timestamp)}
            </Typography>
            {isMe && getStatusIcon()}
          </Box>
        )}
      </Box>
    )

  default:
    return null
  }
}

export default ChatMessage