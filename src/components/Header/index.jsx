import Box from '@mui/material/Box'
import Marqueue from './Markqueue'
import ResponsiveAppBar from './ResponsiveAppBar'

function Header() {

  return (
    <Box sx={{ flexGrow: 1, position: 'fixed', top: 0, zIndex: '1000' }}>
      <Box sx={{
        height: 30,
        display: 'flex',
        alignItems: 'center',
        color: 'text.marquee',
        backgroundColor: '#0f1f5e'
      }}>
        <Marqueue />
      </Box>
      <ResponsiveAppBar />
    </Box>
  )
}

export default Header
