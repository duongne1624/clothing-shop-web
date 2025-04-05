import React, { useState } from 'react'
import {
  Box,
  Paper,
  Grid,
  Typography,
  Divider,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Badge,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Chip
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import SendIcon from '@mui/icons-material/Send'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ImageIcon from '@mui/icons-material/Image'
import CloseIcon from '@mui/icons-material/Close'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { useChatContext } from '~/contexts/ChatContext'
import { useChat } from '../../hook/useChat'
import ChatMessage from './ChatMessage'

const AdminChatPanel = () => {
  const {
    adminChatRooms,
    activeChatRoom,
    acceptChat,
    closeChatRoom
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

  const [searchTerm, setSearchTerm] = useState('')

  // Lọc phòng chat theo từ khóa tìm kiếm
  const filteredRooms = adminChatRooms.filter(room =>
    room.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (room.metadata?.userName && room.metadata.userName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Xử lý chọn phòng chat
  const handleSelectRoom = (userId) => {
    acceptChat(userId)
  }

  // Xử lý đóng phòng chat
  const handleCloseRoom = () => {
    closeChatRoom()
  }

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

  // Hiển thị trạng thái phòng chat
  const getRoomStatusText = (status) => {
    switch (status) {
    case 'active':
      return 'Đang trò chuyện'
    case 'pending':
      return 'Đang chờ'
    case 'requested':
      return 'Yêu cầu mới'
    case 'closed':
      return 'Đã kết thúc'
    default:
      return 'Không xác định'
    }
  }

  // Màu trạng thái phòng chat
  const getRoomStatusColor = (status) => {
    switch (status) {
    case 'active':
      return 'success'
    case 'pending':
      return 'warning'
    case 'requested':
      return 'error'
    case 'closed':
      return 'default'
    default:
      return 'default'
    }
  }

  // Nhóm tin nhắn theo người gửi
  const messageGroups = groupMessagesBySender()

  return (
    <Box sx={{ height: '100%', display: 'flex', overflow: 'hidden' }}>
      <Grid container sx={{ height: '100%' }}>
        {/* Sidebar - Danh sách phòng chat */}
        <Grid item xs={3}
          sx={{
            height: '100%',
            borderRight: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom>
              Danh sách trò chuyện
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  bgcolor: 'white'
                }
              }}
            />
          </Box>

          <Divider />

          <List
            sx={{
              width: '100%',
              bgcolor: 'background.paper',
              overflowY: 'auto',
              flex: 1
            }}
          >
            {filteredRooms.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Không có cuộc trò chuyện nào
                </Typography>
              </Box>
            ) : (
              filteredRooms.map((room) => (
                <ListItemButton
                  key={room.userId}
                  selected={activeChatRoom?.userId === room.userId}
                  onClick={() => handleSelectRoom(room.userId)}
                  sx={{
                    borderLeft: activeChatRoom?.userId === room.userId ? '4px solid #1cb05c' : 'none',
                    bgcolor: room.status === 'requested' ? 'rgba(255, 0, 0, 0.05)' : 'transparent'
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        room.online && (
                          <FiberManualRecordIcon
                            sx={{
                              color: 'success.main',
                              fontSize: 12,
                              backgroundColor: 'white',
                              borderRadius: '50%'
                            }}
                          />
                        )
                      }
                    >
                      <Avatar alt={room.metadata?.userName || room.userId}>
                        {(room.metadata?.userName || room.userId).charAt(0)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" noWrap>
                          {room.metadata?.userName || room.userId}
                        </Typography>
                        {room.unreadCount > 0 && (
                          <Badge
                            badgeContent={room.unreadCount}
                            color="error"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Chip
                          label={getRoomStatusText(room.status)}
                          color={getRoomStatusColor(room.status)}
                          size="small"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                    }
                  />
                </ListItemButton>
              ))
            )}
          </List>
        </Grid>

        {/* Main Chat Area */}
        <Grid item xs={9} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {activeChatRoom ? (
            <>
              {/* Chat Header */}
              <Box
                sx={{
                  p: 2,
                  backgroundColor: '#f5f5f5',
                  borderBottom: '1px solid #e0e0e0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ mr: 1 }}>
                    {activeChatRoom.metadata?.userName?.charAt(0) || activeChatRoom.userId.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">
                      {activeChatRoom.metadata?.userName || activeChatRoom.userId}
                    </Typography>
                    <Chip
                      label={getRoomStatusText(activeChatRoom.status)}
                      color={getRoomStatusColor(activeChatRoom.status)}
                      size="small"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleCloseRoom}
                  startIcon={<CloseIcon />}
                  disabled={activeChatRoom.status === 'closed'}
                >
                  Kết thúc
                </Button>
              </Box>

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
                      Người dùng đang nhập...
                    </Typography>
                  </Box>
                )}

                <div ref={messagesEndRef} />
              </Box>

              {/* Input Area */}
              {activeChatRoom.status === 'active' && (
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: '#f5f5f5',
                    borderTop: '1px solid #e0e0e0'
                  }}
                >
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
                            id="admin-image-upload"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                          />
                          <label htmlFor="admin-image-upload">
                            <IconButton component="span" size="small" sx={{ color: '#1cb05c' }}>
                              <ImageIcon fontSize="small" />
                            </IconButton>
                          </label>

                          <input
                            type="file"
                            id="admin-file-upload"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                          />
                          <label htmlFor="admin-file-upload">
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
              )}
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                bgcolor: '#f5f5f5',
                flexDirection: 'column',
                p: 4,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Chọn một cuộc trò chuyện
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hãy chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu hỗ trợ khách hàng.
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminChatPanel