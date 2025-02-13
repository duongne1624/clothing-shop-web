import { useState } from 'react'
import Box from '@mui/material/Box'
import { useTheme, useMediaQuery } from '@mui/material'
import Button from '@mui/material/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CategoryHoverMenu from './Category'
import Badge from '@mui/material/Badge'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'

function notificationsLabel(count) {
  if (count === 0) {
    return 'no notifications'
  }
  if (count > 99) {
    return 'more than 99 notifications'
  }
  return `${count} notifications`
}

function Header() {
  const handleClickSearch = () => {

  }
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [showSearch, setShowSearch] = useState(false)

  return (
    <Box elevation={2} sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: 'auto',
      overflowX: 'auto',
      overflowY: 'hidden',
      px: 2,
      backgroundColor: 'background.footer',
      boxShadow: '0 1px 5px 2px rgba(0, 0, 0, 0.15)'
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
              height: '40px',
              color: 'black',
              backgroundColor: 'white',
              outline: 'none',
              pr: '0',
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
        <IconButton aria-label={notificationsLabel(100)}>
          <Badge badgeContent={1} color="secondary">
            <ShoppingCartOutlinedIcon color="headerButton" />
          </Badge>
        </IconButton>
        {!isMobile ? (
          <Button
            color="headerButton"
            startIcon= {<AccountCircleOutlinedIcon />}
            endIcon= {<ExpandMoreIcon />}
          >
            Tài khoản
          </Button>
        ) : (
          <IconButton>
            <AccountCircleOutlinedIcon color='headerButton' />
          </IconButton>
        )}
      </Box>
    </Box>
  )
}

export default Header
