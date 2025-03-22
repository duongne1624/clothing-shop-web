import { useState } from 'react'
import { Button, IconButton, Drawer, Box, Typography } from '@mui/material'
import { useTheme, useMediaQuery } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useNavigate } from 'react-router-dom'
import ListCategories from './ListCategories'
import { motion } from 'framer-motion'

const CategoryHoverMenu = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [open, setOpen] = useState(false)

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen)
  }

  return (
    <div>
      {!isMobile ? (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            aria-haspopup='true'
            onClick={toggleDrawer(true)}
            startIcon={<MenuIcon />}
            endIcon={<ExpandMoreIcon />}
            sx={{
              height: (theme) => theme.shop.headerHeight,
              color: '#333',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Danh mục
          </Button>
        </motion.div>
      ) : (
        <IconButton 
          onClick={toggleDrawer(true)}
          sx={{
            color: '#666',
            '&:hover': {
              color: '#000',
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer 
        open={open} 
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 300 },
            maxWidth: '100%',
            borderTopRightRadius: '12px',
            borderBottomRightRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <Box sx={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <MenuIcon sx={{ color: '#333' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
              Danh mục sản phẩm
            </Typography>
          </Box>
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <ListCategories 
              onSelectCategory={(category) => {
                navigate(`/categories/${category}`)
              }}
              onCloseMenu={toggleDrawer(false)} 
            />
          </Box>
        </Box>
      </Drawer>
    </div>
  )
}

export default CategoryHoverMenu
