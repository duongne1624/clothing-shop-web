import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f8f9fa'
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h1" sx={{ fontSize: '8rem', fontWeight: 'bold', color: '#ff4f5a' }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ color: '#6c757d' }}>
          Oops! Trang bạn tìm kiếm không tồn tại.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 3, backgroundColor: '#ff4f5a', ':hover': { backgroundColor: '#ff6b6b' } }}
          onClick={() => navigate('/home')}
        >
          Quay về trang chủ
        </Button>
      </motion.div>
    </Box>
  )
}
