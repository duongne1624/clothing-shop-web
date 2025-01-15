import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  InputBase
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'

function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#ffcc00', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        {/* Logo và Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 'bold', marginLeft: 1 }}
          >
            Chợ Tốt
          </Typography>
        </Box>

        {/* Thanh tìm kiếm */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 1,
            px: 1,
            py: 0.5,
            flexGrow: 1,
            mx: 2
          }}
        >
          <SearchIcon sx={{ color: 'gray', mr: 1 }} />
          <InputBase
            placeholder="Tìm kiếm sản phẩm trên Chợ Tốt"
            fullWidth
            sx={{ fontSize: '0.9rem' }}
          />
        </Box>

        {/* Các nút chức năng */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="contained" color="secondary" sx={{ fontWeight: 'bold' }}>
            Đăng Tin
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header