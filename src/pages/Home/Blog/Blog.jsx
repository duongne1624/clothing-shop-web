import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'


function Blog() {
  return (
    <Box sx={{
      gap: 1,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography variant="h4">Tin thời trang</Typography>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        width: '100%',
        overflowX: 'auto',
        overflowY: 'hidden'
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          width: '30%',
          height: 'auto'
        }}>
        </Box>
      </Box>
    </Box>
  )
}

export default Blog
