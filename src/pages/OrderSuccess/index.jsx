import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Paper, Divider, Grid, CircularProgress, Chip } from '@mui/material'
import { motion } from 'framer-motion'
import HomeIcon from '@mui/icons-material/Home'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PaymentIcon from '@mui/icons-material/Payment'
import { orderApi, fetchProductDetailsAPIById } from '~/apis'
import { showSnackbar } from '~/redux/snackbarSlice'
import { useDispatch } from 'react-redux'
import { API_ROOT } from '~/utils/constants'

const MotionBox = motion(Box)

function OrderSuccess() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const result = await orderApi.getOrderById(orderId)
        await Promise.all(result.items.map(async (item) => {
          const product = await fetchProductDetailsAPIById(item.productId)
          item.image = product.colors[0].images[0]
          item.productName = product.name
        }))
        console.log(result)
        setOrder(result)
      } catch (error) {
        console.error('Error fetching order:', error)
        dispatch(showSnackbar({
          message: 'Có lỗi xảy ra khi lấy thông tin đơn hàng',
          severity: 'error'
        }))
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, dispatch])

  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const getStatusColor = (status) => {
    switch (status) {
    case 'completed':
      return 'success'
    case 'pending':
      return 'warning'
    case 'cancelled':
      return 'error'
    default:
      return 'default'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
    case 'success':
      return 'success'
    case 'pending':
      return 'warning'
    case 'failed':
      return 'error'
    default:
      return 'default'
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!order) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5" color="error">Không tìm thấy đơn hàng</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/home')}>
          Về trang chủ
        </Button>
      </Box>
    )
  }

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return ''
    const url = String(imageUrl)
    if (url.startsWith('http')) return url
    return `${API_ROOT}${url}`
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        py: 4,
        px: 2
      }}
    >
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: 'linear-gradient(45deg, #ffffff 30%, #f8f9fa 90%)'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#4caf50', fontWeight: 'bold' }}>
              🎉 Đặt hàng thành công!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                  <LocalShippingIcon /> Thông tin giao hàng
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Họ và tên</Typography>
                  <Typography>{order.name}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Số điện thoại</Typography>
                  <Typography>{order.phone}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Địa chỉ</Typography>
                  <Typography>{order.address}</Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                  <PaymentIcon /> Thông tin thanh toán
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Mã đơn hàng</Typography>
                  <Typography>{order._id}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Phương thức thanh toán</Typography>
                  <Typography sx={{ textTransform: 'capitalize' }}>{order.paymentMethod}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Trạng thái thanh toán</Typography>
                  <Chip
                    label={order.paymentStatus === 'success' ? 'Thành công' : 'Thất bại'}
                    color={getPaymentStatusColor(order.paymentStatus)}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Trạng thái đơn hàng</Typography>
                  <Chip
                    label={order.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                    color={getStatusColor(order.status)}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                  <ShoppingBagIcon /> Chi tiết đơn hàng
                </Typography>
                <Divider sx={{ my: 2 }} />
                {order.items.map((item, index) => (
                  <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 80, height: 80 }}>
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.productName}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{item.productName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.color} / {item.size}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Số lượng: {item.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(item.price * item.quantity)}₫
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Tạm tính:</Typography>
                  <Typography>{formatCurrency(order.amount)}₫</Typography>
                </Box>
                {order.discountAmount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography>Giảm giá:</Typography>
                    <Typography color="error">-{formatCurrency(order.discountAmount)}₫</Typography>
                  </Box>
                )}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" color="primary">Tổng cộng:</Typography>
                  <Typography variant="h6" color="primary">{formatCurrency(order.lastAmount)}₫</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

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
            <Button
              variant="outlined"
              startIcon={<ShoppingBagIcon />}
              onClick={() => navigate('/orders')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                py: 1
              }}
            >
              Xem tất cả đơn hàng
            </Button>
          </Box>
        </Paper>
      </Box>
    </MotionBox>
  )
}

export default OrderSuccess
