import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge, IconButton, Tooltip } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import { useChatContext } from '~/contexts/ChatContext'
import ChatPanel from './ChatPanel'

const ChatBubble = () => {
  const { chatState, openChat, unreadCount, isAdmin } = useChatContext()

  // Nếu là admin thì không hiển thị ChatBubble
  if (isAdmin) return null

  // Xử lý click vào biểu tượng chat
  const handleClickChat = () => {
    openChat()
  }

  // Animation cho biểu tượng chat
  const bubbleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.3
      }
    },
    tap: {
      scale: 0.9
    }
  }

  // Animation cho badge
  const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.3
      }
    }
  }

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {chatState !== 'closed' && <ChatPanel />}
      </AnimatePresence>

      {/* Chat Bubble */}
      <AnimatePresence>
        {chatState === 'closed' && (
          <motion.div
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 1000
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={bubbleVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Tooltip title="Chat với hỗ trợ viên" arrow placement="left">
              <IconButton
                aria-label="Mở khung chat"
                onClick={handleClickChat}
                sx={{
                  backgroundColor: '#1cb05c',
                  color: 'white',
                  width: '60px',
                  height: '60px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    backgroundColor: '#169c4f'
                  }
                }}
              >
                <Badge
                  badgeContent={unreadCount}
                  color="error"
                  invisible={unreadCount === 0}
                  overlap="circular"
                  componentsProps={{
                    badge: {
                      component: motion.div,
                      initial: 'hidden',
                      animate: 'visible',
                      variants: badgeVariants
                    }
                  }}
                >
                  <ChatIcon sx={{ fontSize: '28px' }} />
                </Badge>
              </IconButton>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatBubble