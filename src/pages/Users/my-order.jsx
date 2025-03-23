import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, Paper, Typography, Grid, Chip, CircularProgress, Tabs, Tab, Button } from '@mui/material'
import { motion } from 'framer-motion'
import { orderApi, fetchProductDetailsAPIById } from '~/apis'
import { showSnackbar } from '~/redux/snackbarSlice'
import { useDispatch } from 'react-redux'
import { API_ROOT } from '~/utils/constants'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useNavigate } from 'react-router-dom'

const MotionBox = motion(Box)

function MyOrder() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate('/')
    const fetchOrders = async () => {
      try {
        const result = await orderApi.getOrderByUserId(user._id)
        await Promise.all(result.map(async (order) => {
          await Promise.all(order.items.map(async (item) => {
            const product = await fetchProductDetailsAPIById(item.productId)
            item.image = product.colors[0].images[0]
            item.productName = product.name
          }))
        }))
        setOrders(result)
      } catch (error) {
        console.error('Error fetching orders:', error)
        dispatch(showSnackbar({
          message: 'Có lỗi xảy ra khi lấy thông tin đơn hàng',
          severity: 'error'
        }))
      } finally {
        setLoading(false)
      }
    }

    if (user?._id) {
      fetchOrders()
    }
  }, [user?._id, dispatch])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

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

  const getStatusIcon = (status) => {
    switch (status) {
    case 'completed':
      return <CheckCircleIcon />
    case 'pending':
      return <ShoppingBagIcon />
    case 'cancelled':
      return <CancelIcon />
    default:
      return <LocalShippingIcon />
    }
  }

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return ''
    const url = String(imageUrl)
    if (url.startsWith('http')) return url
    return `${API_ROOT}${url}`
  }

  const filteredOrders = orders.filter(order => {
    switch (tabValue) {
    case 0:
      return true
    case 1:
      return order.status === 'pending'
    case 2:
      return order.status === 'shipping'
    case 3:
      return order.status === 'completed'
    case 4:
      return order.status === 'cancelled'
    default:
      return true
    }
  })

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
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
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: 'linear-gradient(45deg, #ffffff 30%, #f8f9fa 90%)'
          }}
        >
          <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 4 }}>
            Đơn hàng của tôi
          </Typography>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 4 }}
          >
            <Tab label="Tất cả" />
            <Tab label="Đang chờ" />
            <Tab label="Đang giao" />
            <Tab label="Hoàn thành" />
            <Tab label="Đã hủy" />
          </Tabs>

          {filteredOrders.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Không có đơn hàng nào
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => window.location.href = '/categories/all-products'}
              >
                Mua sắm ngay
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredOrders.map((order) => (
                <Grid item xs={12} key={order._id}>
                  <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Mã đơn hàng: {order._id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </Typography>
                      </Box>
                      <Chip
                        icon={getStatusIcon(order.status)}
                        label={order.status === 'completed' ? 'Hoàn thành' :
                          order.status === 'pending' ? 'Đang chờ' :
                            order.status === 'cancelled' ? 'Đã hủy' : 'Đang giao'}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      {order.items.map((item, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 2,
                            p: 2,
                            bgcolor: '#f8f9fa',
                            borderRadius: 1
                          }}
                        >
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
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              {item.productName}
                            </Typography>
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
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Tổng tiền:
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {formatCurrency(order.lastAmount)}₫
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        onClick={() => window.location.href = `/order-success/${order._id}`}
                      >
                        Xem chi tiết
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Box>
    </MotionBox>
  )
}

export default MyOrder