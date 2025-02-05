import { useState } from 'react'
import { Button, IconButton, Menu, MenuItem } from '@mui/material'
import { useTheme, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import ListCategories from './ListCategories'
import { categories } from '~/assets/categories'

const CustomMenu = styled(Menu)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: '0'
  },
  '& .MuiPaper-root .MuiMenu-list': {
    padding: '0'
  }
}))

const CustomMenuItem = styled(MenuItem)(() => ({
  '&:hover': {
    backgroundColor: '#e6e6e6'
  },
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 10,
  fontSize: '0.875rem',
  padding: '15px 20px',
  width: '250px'
}))

const CategoryHoverMenu = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMouseLeave = () => {
    setAnchorEl(null)
  }

  const [open, setOpen] = useState(false)

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen)
  }

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" >
      <ListCategories />
    </Box>
  )

  return (
    <div>
      {!isMobile ? (
        <>
          <Button
            aria-haspopup='true'
            onMouseEnter={handleMouseEnter}
            startIcon={<MenuIcon />}
            endIcon={<ExpandMoreIcon />}
          >
            Danh mục
          </Button>
          <CustomMenu
            id='category-menu'
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMouseLeave}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            {categories.map((category) => (
              <CustomMenuItem key={category.label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img width='20' height='20' src={category.icon} alt={category.alt} /> {category.label}
                </div>
                <KeyboardArrowRightIcon />
              </CustomMenuItem>
            ))}
          </CustomMenu>
        </>
      ) : (
        <>
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon color='headerButton' />
          </IconButton>
          <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>
        </>
      )}
    </div>
  )
}

export default CategoryHoverMenu
