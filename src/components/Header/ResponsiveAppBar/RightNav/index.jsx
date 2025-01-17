import * as React from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleClickCard = (event) => {
    setAnchorEl(event.currentTarget)
  }
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Cards">
          <IconButton
            onClick={handleClickCard}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <ShoppingCartOutlinedIcon sx={{ width: 30, height: 30, color: 'text.appbar' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 45, height: 45, color: 'white' }} src="/broken-image.jpg" />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose} sx={{ color: 'black' }}>
          <Avatar sx={{ color: 'white' }} /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ color: 'black' }}>
          <Avatar sx={{ color: 'white' }} /> My account
        </MenuItem>
        <hr style={{ color: '#c7c7c7' }} />
        <MenuItem onClick={handleClose} sx={{ color: 'black' }}>
          <ListItemIcon>
            <PersonAdd fontSize="small" sx={{ color: 'black' }} />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ color: 'black' }}>
          <ListItemIcon>
            <Settings fontSize="small" sx={{ color: 'black' }} />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ color: 'black' }}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: 'black' }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}
