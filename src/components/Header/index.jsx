import { AppBar, Toolbar, Typography, Box } from '@mui/material'

function Header() {

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      px: 2
    }}>
      <Box sx={{

      }}>
        <Toolbar>
          {/* SVG Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" component="div">
              My Application
            </Typography>
          </Box>
        </Toolbar>
      </Box>
      <Box>
          ádad
      </Box>
    </Box>
  )
}

export default Header
