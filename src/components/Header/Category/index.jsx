import { useState } from 'react'
import { Button, Menu, MenuItem } from '@mui/material'
import { styled } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckroomIcon from '@mui/icons-material/Checkroom'

const CustomMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#ffffff', // Màu nền
    color: '#000000', // Màu chữ
    padding: '0 0'
  },
  '& .MuiPaper-root .css-1toxriw-MuiList-root-MuiMenu-list': {
    padding: '0 0'
  }
}))

const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#e6e6e6' // Màu hover
  },
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontSize: '0.875rem'
}))

const CategoryHoverMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMouseLeave = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button
        aria-haspopup="true"
        onMouseEnter={handleMouseEnter}
        startIcon={<MenuIcon />}
        endIcon={<ExpandMoreIcon />}
      >
        Danh mục
      </Button>

      <CustomMenu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMouseLeave}
        MenuListProps={{
          onMouseLeave: handleMouseLeave
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <CustomMenuItem > <CheckroomIcon /> Danh mục 1</CustomMenuItem>
        <CustomMenuItem >Danh mục 2</CustomMenuItem>
      </CustomMenu>
    </div>
  )
}

export default CategoryHoverMenu
