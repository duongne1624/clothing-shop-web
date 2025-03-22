import { Box, Paper, Typography, Divider } from '@mui/material'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

function CheckoutLayout({ children, title }) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        py: 4
      }}
    >
      <Box sx={{
        maxWidth: '1200px',
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
            color: 'white'
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Vui lòng kiểm tra thông tin trước khi thanh toán
          </Typography>
        </Paper>

        {/* Main Content */}
        <Box sx={{
          display: 'flex',
          gap: 4,
          flexDirection: { xs: 'column', md: 'row' }
        }}>
          {children}
        </Box>
      </Box>
    </MotionBox>
  )
}

export default CheckoutLayout