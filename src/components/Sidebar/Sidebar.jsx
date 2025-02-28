import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, IconButton, Typography } from '@mui/material'
import { styled } from '@mui/system'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import BarChartIcon from '@mui/icons-material/BarChart'
import MenuIcon from '@mui/icons-material/Menu'

const SidebarContainer = styled(Box)(({ theme, open }) => ({
  width: open ? 200 : 60,
  transition: 'width 0.3s ease',
  backgroundColor: theme.palette.grey[200],
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: open ? 'flex-start' : 'center',
  padding: open ? '10px' : '10px 0',
  position: 'fixed',
  left: 0,
  top: 0,
  boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
}))

const SidebarItem = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  textDecoration: 'none',
  color: theme.palette.text.primary,
  padding: '10px 15px',
  width: '100%',
  borderRadius: 8,
  transition: 'background 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.grey[300]
  }
}))

export default function Sidebar() {
  const [open, setOpen] = useState(true)

  return (
    <SidebarContainer open={open}>
      <IconButton onClick={() => setOpen(!open)} sx={{ alignSelf: 'center', mb: 2 }}>
        <MenuIcon />
      </IconButton>
      <SidebarItem to="/admin/dashboard">
        <DashboardIcon /> {open && <Typography>Dashboard</Typography>}
      </SidebarItem>
      <SidebarItem to="/admin/products">
        <ShoppingCartIcon /> {open && <Typography>Products</Typography>}
      </SidebarItem>
      <SidebarItem to="/admin/users">
        <BarChartIcon /> {open && <Typography>Users</Typography>}
      </SidebarItem>
    </SidebarContainer>
  )
}
