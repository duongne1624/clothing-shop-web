import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Chip,
  Divider,
  TextField,
  InputAdornment
} from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import SearchIcon from '@mui/icons-material/Search'
import { useChatContext } from '~/contexts/ChatContext'
import { useChat } from '../../hooks/useChat'

const ChatList = () => {
  const { adminChatRooms } = useChatContext()
  const { adminAcceptNewChat } = useChat()
  const [searchTerm, setSearchTerm] = useState('')

  // Đếm số lượng yêu cầu chat mới
  const newRequestsCount = adminChatRooms.filter(room => room.status === 'requested').length

  // Sắp xếp và lọc phòng chat
  const sortedAndFilteredRooms = [...adminChatRooms]
    .sort((a, b) => {
      // Ưu tiên hiển thị yêu cầu chat mới trước
      if (a.status === 'requested' && b.status !== 'requested') return -1
      if (a.status !== 'requested' && b.status === 'requested') return 1

      // Sau đó sắp xếp theo thời gian tin nhắn cuối cùng
      return (b.lastMessageTime || 0) - (a.lastMessageTime || 0)
    })
    .filter(room => {
      if (!searchTerm) return true

      const searchTermLower = searchTerm.toLowerCase()
      const userName = room.metadata?.userName?.toLowerCase() || ''
      const userId = room.userId.toLowerCase()

      return userName.includes(searchTermLower) || userId.includes(searchTermLower)
    })

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

  return (
    <Box>
      <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          Danh sách trò chuyện
          {newRequestsCount > 0 && (
            <Chip
              label={`${newRequestsCount} yêu cầu mới`}
              color="error"
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Tìm kiếm người dùng..."
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

      <List sx={{ width: '100%', bgcolor: 'background.paper', overflow: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
        {sortedAndFilteredRooms.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Không có cuộc trò chuyện nào
            </Typography>
          </Box>
        ) : (
          sortedAndFilteredRooms.map((room) => (
            <ListItem
              key={room.userId}
              alignItems="flex-start"
              button
              onClick={() => adminAcceptNewChat(room.userId)}
              sx={{
                borderLeft: room.status === 'requested' ? '4px solid #f44336' : 'none',
                bgcolor: room.status === 'requested' ? 'rgba(255, 0, 0, 0.05)' : 'transparent',
                '&:hover': {
                  bgcolor: room.status === 'requested' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.04)'
                }
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{ mb: 0.5 }}
                    >
                      {room.lastMessage || 'Chưa có tin nhắn nào'}
                    </Typography>
                    <Chip
                      label={getRoomStatusText(room.status)}
                      color={getRoomStatusColor(room.status)}
                      size="small"
                      sx={{ height: 20, fontSize: '0.7rem', width: 'fit-content' }}
                    />
                  </Box>
                }
              />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  )
}

export default ChatList