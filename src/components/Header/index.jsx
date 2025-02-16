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

  const handleClickSearch = () => {

  }
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [showSearch, setShowSearch] = useState(false)

  return (
    <Box elevation={2} sx={{
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
      height: (theme) => theme.shop.headerHeight
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
          src="https://static.chotot.com/storage/APP_WRAPPER/logo/chotot-logo-appwrapper.png"
          alt="logo"
          width={120}
          height={45}
          style={{ objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => navigate('/')}
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
            sx={{
              height: '35px',
              color: 'black',
              backgroundColor: 'white',
              border: '1px solid #000000',
              pr: '0',
              my: 1,
              display: isMobile && !showSearch ? 'none' : 'flex'
            }}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton onClick={handleClickSearch}><SearchIcon /></IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton onClick={() => setShowSearch(true)}>
            <SearchIcon color='headerButton' />
          </IconButton>
        )}

        <Cart />

        <Account />
      </Box>
    </Box>
  )
}

export default Header
