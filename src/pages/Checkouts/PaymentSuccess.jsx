import { useNavigate, useSearchParams } from 'react-router-dom'
import { Box, CircularProgress, Typography, Paper, Button } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HomeIcon from '@mui/icons-material/Home'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useEffect, useState } from 'react'
import { orderApi } from '~/apis'
import { showSnackbar } from '~/redux/snackbarSlice'
import { useDispatch } from 'react-redux'

const MotionBox = motion(Box)

function PaymentSuccess() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const apptransid = searchParams.get('apptransid')
        if (apptransid === '1') {
          setOrderId(searchParams.get('orderId'))
        } else {
          const result = await orderApi.getOrderByTranId(apptransid)
          setOrderId(result._id)
        }
      } catch (error) {
        dispatch(showSnackbar({
          message: 'Có lỗi xảy ra khi lấy thông tin đơn hàng',
          severity: 'error'
        }))
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [searchParams, dispatch])

  const status = searchParams.get('status')
  const isSuccess = status === '1'

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        p: 2
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          background: 'linear-gradient(45deg, #ffffff 30%, #f8f9fa 90%)'
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={40} sx={{ color: '#1976d2' }} />
            <Typography variant="h6" sx={{ mt: 2, color: '#1976d2' }}>
              Đang xử lý...
            </Typography>
          </>
        ) : isSuccess ? (
          <>
            <CheckCircleIcon
              sx={{
                fontSize: 80,
                color: '#4caf50',
                mb: 2
              }}
            />
            <Typography variant="h4" gutterBottom sx={{ color: '#4caf50', fontWeight: 'bold' }}>
              Đặt hàng thành công!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
            </Typography>
            <CircularProgress size={24} sx={{ color: '#4caf50' }} />
          </>
        ) : (
          <>
            <ErrorIcon
              sx={{
                fontSize: 80,
                color: '#f44336',
                mb: 2
              }}
            />
            <Typography variant="h4" gutterBottom sx={{ color: '#f44336', fontWeight: 'bold' }}>
              Thanh toán thất bại!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
            </Typography>
            <CircularProgress size={24} sx={{ color: '#f44336' }} />
          </>
        )}

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/home')}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1
            }}
          >
            Về trang chủ
          </Button>
          {isSuccess && (
            <Button
              variant="outlined"
              startIcon={<ShoppingCartIcon />}
              onClick={() => navigate(`/order-success?orderId=${orderId}`)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                py: 1
              }}
            >
              Xem đơn hàng
            </Button>
          )}
        </Box>
      </Paper>
    </MotionBox>
  )
}

export default PaymentSuccess
