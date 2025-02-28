import { useState } from 'react'
import Box from '@mui/material/Box'
import { useTheme, useMediaQuery } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CategoryHoverMenu from './Category'
import { useNavigate } from 'react-router-dom'
import Account from './Account/Account'
import Cart from './Cart/Cart'

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

  return (
    <Box elevation={2} sx={{
      position: 'relative',
      top: 0,
      left: 0,
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      overflowY: 'hidden',
      overflowX: 'auto',
      px: 2,
      backgroundColor: 'background.footer',
      boxShadow: '0 1px 5px 2px rgba(0, 0, 0, 0.15)',
      height: (theme) => theme.shop.headerHeight,
      zIndex: 1000
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: {
          sm: 2,
          xs: 0
        }
      }}>
        <img
          src="/logo-web.png"
          alt="logo"
          width={120}
          height={45}
          style={{ objectFit: 'cover', cursor: 'pointer', paddingTop: 2 }}
          onClick={() => navigate('/home')}
        />
        <CategoryHoverMenu />
      </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: {
          sm: 2,
          xs: 0
        }
      }}>
        {!isMobile ? (
          <OutlinedInput
            value={searchKeyword}
            onChange={handleChange}
            onKeyDown={onKeyPress}
            placeholder="Tìm kiếm..."
            sx={{
              height: '35px',
              color: 'black',
              backgroundColor: 'white',
              border: '1px solid #000000',
              pr: '0',
              my: 1,
              fontSize: '0.875rem',
              '.MuiOutlinedInput-notchedOutline': {
                border: 'none !important'
              }
            }}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton onClick={handleClickSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton onClick={handleOpenSearch}>
            <SearchIcon color='headerButton' />
          </IconButton>
        )}

        <Cart />
        <Account />
      </Box>

      {/* Mobile Search Box (nằm trên header) */}
      {isMobile && showSearch && (
        <Box
          sx={{
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
          <Box
            sx={{
              width: '100%',
              backgroundColor: 'white',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              height: (theme) => theme.shop.headerHeight
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <OutlinedInput
              fullWidth
              value={searchKeyword}
              onChange={handleChange}
              onKeyDown={onKeyPress}
              autoFocus
              placeholder="Tìm kiếm..."
              sx={{
                height: '40px',
                fontSize: '1rem',
                color: 'black',
                backgroundColor: 'white',
                border: '1px solid #ccc'
              }}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton onClick={handleClickSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Header
