import { useState } from 'react'
import Box from '@mui/material/Box'
import { useTheme, useMediaQuery, Paper, Container, InputBase, IconButton, Button, Badge } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CategoryHoverMenu from './Category'
import { useNavigate } from 'react-router-dom'
import Account from './Account/Account'
import Cart from './Cart/Cart'
import { motion, AnimatePresence } from 'framer-motion'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import SecurityIcon from '@mui/icons-material/Security'
import FiberNewIcon from '@mui/icons-material/FiberNew'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'

function Header() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [showSearch, setShowSearch] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')

  const handleChange = (event) => {
    setSearchKeyword(event.target.value)
  }

  const handleClickSearch = () => {
    if (searchKeyword.trim().length < 1) return
    navigate(`/Search/${searchKeyword}`)
    handleCloseSearch()
  }

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleClickSearch()
    }
  }

  const handleOpenSearch = () => {
    setShowSearch(true)
  }

  const handleCloseSearch = () => {
    setShowSearch(false)
  }

  const navItems = [
    {
      label: 'HÀNG MỚI',
      path: '/categories/new-arrivals',
      icon: <FiberNewIcon sx={{ fontSize: 16 }} />,
      isNew: true
    },
    {
      label: 'TẤT CẢ SẢN PHẨM',
      path: '/categories/all-products'
    },
    {
      label: 'ÁO NAM',
      path: '/categories/mens-shirts'
    },
    {
      label: 'QUẦN NAM',
      path: '/categories/mens-pants'
    },
    {
      label: 'KHUYẾN MÃI',
      path: '/categories/sale',
      icon: <LocalOfferIcon sx={{ fontSize: 16 }} />,
      isHot: true
    },
    {
      label: 'TIN TỨC',
      path: '/fashion-news'
    }
  ]

  return (
    <Box sx={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #eee',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Top Bar */}
      <Box sx={{
        backgroundColor: '#f8f8f8',
        py: 0.5,
        borderBottom: '1px solid #eee',
        display: { xs: 'none', md: 'block' }
      }}>
        <Container maxWidth="xl">
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#666',
            fontSize: '0.875rem'
          }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocalShippingIcon sx={{ fontSize: 16 }} />
                <span>Miễn phí vận chuyển đơn từ 399k</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <SupportAgentIcon sx={{ fontSize: 16 }} />
                <span>Hỗ trợ 24/7</span>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SecurityIcon sx={{ fontSize: 16 }} />
              <span>Thanh toán an toàn</span>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Header */}
      <Container maxWidth="xl">
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 0.5,
          gap: 2
        }}>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/home')}
          >
            <img
              src="/logo-web.png"
              alt="logo"
              width={120}
              height={45}
              style={{ objectFit: 'cover' }}
            />
          </motion.div>

          {/* Search Bar */}
          {!isMobile ? (
            <Paper
              component="form"
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: '400px',
                backgroundColor: '#f5f5f5',
                border: '1px solid transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#eeeeee'
                },
                '&.Mui-focused': {
                  backgroundColor: '#ffffff',
                  border: '1px solid #000000',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Tìm kiếm sản phẩm..."
                value={searchKeyword}
                onChange={handleChange}
                onKeyDown={onKeyPress}
              />
              <IconButton
                type="button"
                sx={{ p: '10px' }}
                onClick={handleClickSearch}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          ) : (
            <IconButton
              onClick={handleOpenSearch}
              sx={{
                color: '#666',
                '&:hover': {
                  color: '#000',
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              <SearchIcon />
            </IconButton>
          )}

          {/* Right Actions */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <CategoryHoverMenu />
            <Cart />
            <Account />
          </Box>
        </Box>

        {/* Navigation Menu */}
        {!isMobile && (
          <Box
            component="nav"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 0.5,
              py: 1,
              borderTop: '1px solid #eee',
              backgroundColor: '#ffffff'
            }}
          >
            {navItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Button
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: location.pathname === item.path ? '#000' : '#333',
                    fontSize: '0.9rem',
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    px: 2,
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#000'
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: location.pathname === item.path ? '80%' : 0,
                      height: '2px',
                      backgroundColor: '#000',
                      transition: 'all 0.3s ease',
                      transform: 'translateX(-50%)'
                    },
                    '&:hover::after': {
                      width: '80%'
                    }
                  }}
                  startIcon={item.icon}
                >
                  {item.label}
                  {item.isNew && (
                    <Box
                      component="span"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: '#ff4d4f',
                        color: '#fff',
                        fontSize: '0.7rem',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        transform: 'translate(50%, -50%)'
                      }}
                    >
                      NEW
                    </Box>
                  )}
                  {item.isHot && (
                    <Box
                      component="span"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: '#ff9800',
                        color: '#fff',
                        fontSize: '0.7rem',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        transform: 'translate(50%, -50%)'
                      }}
                    >
                      HOT
                    </Box>
                  )}
                </Button>
              </motion.div>
            ))}
          </Box>
        )}
      </Container>

      {/* Mobile Search */}
      <AnimatePresence>
        {isMobile && showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'start',
              justifyContent: 'left',
              zIndex: 9999
            }}
            onClick={handleCloseSearch}
          >
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              transition={{ duration: 0.3 }}
              style={{
                width: '100%',
                backgroundColor: 'white',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                height: theme.shop.headerHeight
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Paper
                component="form"
                sx={{
                  p: '2px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  mx: 1,
                  backgroundColor: '#f5f5f5',
                  border: '1px solid transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#eeeeee'
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    border: '1px solid #000000',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchKeyword}
                  onChange={handleChange}
                  onKeyDown={onKeyPress}
                  autoFocus
                />
                <IconButton
                  type="button"
                  sx={{ p: '10px' }}
                  onClick={handleClickSearch}
                >
                  <SearchIcon />
                </IconButton>
              </Paper>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default Header
