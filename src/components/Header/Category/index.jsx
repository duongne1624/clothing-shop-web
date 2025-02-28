import { useState } from 'react'
import { Button, IconButton, Drawer, Box } from '@mui/material'
import { useTheme, useMediaQuery } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useNavigate } from 'react-router-dom'
import ListCategories from './ListCategories'

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
        <Button
          aria-haspopup='true'
          onClick={toggleDrawer(true)}
          startIcon={<MenuIcon />}
          endIcon={<ExpandMoreIcon />}
          height={(theme) => theme.shop.headerHeight}
        >
          Danh mục
        </Button>
      ) : (
        <IconButton onClick={toggleDrawer(true)}>
          <MenuIcon color='headerButton' />
        </IconButton>
      )}

      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }}>
          <ListCategories onSelectCategory={(category) => {
            navigate(`/categories/${category}`)
          }}
          onCloseMenu={toggleDrawer(false)} />
        </Box>
      </Drawer>
    </div>
  )
}

export default CategoryHoverMenu
