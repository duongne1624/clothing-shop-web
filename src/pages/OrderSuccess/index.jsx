import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function OrderSuccess() {
  const navigate = useNavigate()

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h5" color="primary">🎉 Đặt hàng thành công!</Typography>
      <Typography sx={{ mt: 2 }}>Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.</Typography>

      <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/home')}>
        Quay lại trang chủ
      </Button>
    </Box>
  )
}

export default OrderSuccess
