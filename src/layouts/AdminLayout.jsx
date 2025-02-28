import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import CategoryIcon from '@mui/icons-material/Category'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import DiscountIcon from '@mui/icons-material/Discount'
import ReceiptIcon from '@mui/icons-material/Receipt'
import LogoutIcon from '@mui/icons-material/Logout'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { Outlet } from 'react-router-dom'
import { Paper } from '@mui/material'
import { authApi } from '~/apis'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '~/redux/authSlide'

const menuItems = [
  { name: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { name: 'users', label: 'Users', icon: <AccountBoxIcon /> },
  { name: 'categories', label: 'Categories', icon: <CategoryIcon /> },
  { name: 'products', label: 'Products', icon: <ShoppingCartIcon /> },
  { name: 'orders', label: 'Orders', icon: <ReceiptIcon /> },
  { name: 'payments', label: 'Payments', icon: <AttachMoneyIcon /> },
  { name: 'coupons', label: 'Coupons', icon: <DiscountIcon /> }
]

export default function AdminLayout() {
  const [isExpanded, setIsExpanded] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    authApi.logout()
    dispatch(logout())
    navigate('/login')
  }

  return (
    <Box sx={{ display: 'flex', maxHeight: '100vh', maxWidth: '100vw' }}>
      {/* Header */}
      <Box sx={{ width: '100%', position: 'fixed', top: 0, left: 0, bgcolor: 'white', boxShadow: '0 1px 5px 2px rgba(0, 0, 0, 0.1)', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1200, height: (theme) => theme.shop.headerHeight }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => setIsExpanded(!isExpanded)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Admin Panel</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Admin Profile">
            <IconButton>
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Sidebar */}
      <Box
        sx={{
          width: isExpanded ? 180 : 60,
          bgcolor: 'grey.100',
          height: (theme) => `calc(100vh - ${theme.shop.headerHeight})`,
          transition: 'width 0.3s ease-in-out',
          overflow: 'hidden',
          boxShadow: '0 1px 5px 2px rgba(0, 0, 0, 0.1)',
          mt: (theme) => theme.shop.headerHeight
        }}
      >
        <nav>
          <ul style={{ listStyle: 'none', padding: '0', display: 'flex', flexDirection: 'column', marginTop: '0px' }}>
            {menuItems.map((item) => (
              <li key={item.label}>
                <Box sx={{ color: location.pathname === `/admin/${item.name}` ? 'blue' : 'inherit', backgroundColor: location.pathname === `/admin/${item.name}` ? '#e0f7fa' : 'transparent', padding: '16px' }}>
                  <Tooltip title={!isExpanded ? `${item.label}` : ''} placement="right">
                    <Link to={`/admin/${item.name}`} style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', color: 'inherit', fontSize: '1em' }}>
                      {item.icon} {isExpanded && `${item.label}`}
                    </Link>
                  </Tooltip>
                </Box>
              </li>
            ))}
          </ul>
        </nav>
      </Box>
      <Box sx={{ marginTop: (theme) => theme.shop.headerHeight, width: '100%', p: 5 }}>
        <Paper sx={{ width: '100%', height: '100%', boxShadow: '0 1px 5px 2px rgba(0, 0, 0, 0.02)', p: 2 }}>
          <Outlet />
        </Paper>
      </Box>
    </Box>
  )
}
