import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function Product() {
  return (
    <Box sx={{
      maxWidth: '250px',
      minWidth: '250px',
      height: 'auto',
      border: '1px solid black',
      borderRadius: '5px',
      display: 'flex',
      flexDirection: 'column',
      px: 1,
      py: 1,
      gap: 1
    }}>
      <img src="/Images/Users/avartar-default.jpg" alt='banner' style={{ width: '100%', height: 'auto' }} />
      <Typography variant='h6'>Áo jean nam xanh</Typography>
      <Typography variant='body1' fontWeight='bold'>599,000đ</Typography>
      <Box sx={{
        display: 'flex',
        gap: 1,
        width: '100%',
        overflowX: 'auto',
        overflowY: 'hidden'
      }}>
        <Box sx={{
          width: 35,
          borderRadius: '50px',
          overflow: 'hidden'
        }}>
          <img src="/Images/Users/avartar-default.jpg" alt='banner' style={{ width: '100%', height: 'auto' }} />
        </Box>
        <Box sx={{
          width: 35,
          borderRadius: '50px',
          overflow: 'hidden'
        }}>
          <img src="/Images/Users/avartar-default.jpg" alt='banner' style={{ width: '100%', height: 'auto' }} />
        </Box>
      </Box>
    </Box>
  )
}

export default Product