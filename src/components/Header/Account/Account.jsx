import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import HistoryIcon from '@mui/icons-material/History'
import PortraitIcon from '@mui/icons-material/Portrait'
import { useTheme, useMediaQuery, Divider } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { authApi } from '~/apis'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '~/redux/authSlide'

function Account() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const { user } = useSelector(state => state.auth)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    authApi.logout()
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div>
      {user ? (
        <>
          {!isMobile ? (
            <Button
              color="headerButton"
              startIcon={<AccountCircleOutlinedIcon />}
              endIcon={<ExpandMoreIcon />}
              onClick={handleClick}
            >
              Tài khoản
            </Button>
          ) : (
            <IconButton>
              <AccountCircleOutlinedIcon color='headerButton' onClick={handleClick} />
            </IconButton>
          )}

          {open && <div className="overlay" onClick={handleClose}></div>}

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem onClick={() => {
              setAnchorEl(null)
              navigate('/profile')
            }} sx={
              {
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }
            }> <PortraitIcon /> Thông tin</MenuItem>
            <MenuItem onClick={() => {
              setAnchorEl(null)
              navigate('/my-order')
            }} sx={
              {
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }
            }> <HistoryIcon /> Xem lịch sử đơn hàng</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={
              {
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }
            }> <LogoutIcon /> Đăng xuất</MenuItem>
          </Menu>
        </>
      ) : (
        <>
          {!isMobile ? (
            <Button
              color="headerButton"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </Button>
          ) : (
            <IconButton
              color="headerButton"
              onClick={() => navigate('/login')}
            >
              <LoginIcon />
            </IconButton>
          )}
        </>
      )}
      <style>
        {`
          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10;
          }
        `}
      </style>
    </div>
  )
}

export default Account
