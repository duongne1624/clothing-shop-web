import { useSelector } from 'react-redux'
import { Box, CircularProgress } from '@mui/material'

function GlobalLoading() {
  const isLoading = useSelector(state => state.loading.isLoading)

  return isLoading ? (
    <Box sx={{
      width: '100vw',
      height: '100vh',
      position: 'absolute',
      zIndex: 1500,
      backgroundColor: '#b5b5b5',
      display: 'flex',
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      justifyItems: 'center'
    }}>
      <CircularProgress size={30}/>
    </Box>
  ) : null
}

export default GlobalLoading
