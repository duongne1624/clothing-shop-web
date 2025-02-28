import { useEffect, useState } from 'react'
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { getOrderById, fetchProductDetailsAPIById } from '~/apis'

function OrderSuccess() {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [productNames, setProductNames] = useState({})

  useEffect(() => {
    getOrderById(orderId)
      .then((order) => {
        if (order) {
          setOrder(order)
          setLoading(false)
        }
      })
      .catch(() => {})
  }, [orderId, navigate])

  useEffect(() => {
    if (order?.items) {
      order.items.forEach((item) => {
        fetchProductDetailsAPIById(item.productId)
          .then(product => {
            setProductNames(prev => ({
              ...prev,
              [item.productId]: product.name
            }))
          })
          .catch(() => {
            setProductNames(prev => ({
              ...prev,
              [item.productId]: 'Không tìm thấy sản phẩm'
            }))
          })
      })
    }
  }, [order])

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h5" color="primary">🎉 Đặt hàng thành công!</Typography>
      <Typography sx={{ mt: 2 }}>Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.</Typography>

      {loading ? (
        <CircularProgress sx={{ mt: 3 }} />
      ) : order ? (
        <Box sx={{ mt: 3, textAlign: 'left', maxWidth: 500, margin: '0 auto' }}>
          <Typography variant="h6">Chi tiết đơn hàng</Typography>
          <Typography><strong>Mã đơn hàng:</strong> {order._id}</Typography>
          <Typography><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</Typography>
          <Typography><strong>Trạng thái:</strong> {order.status}</Typography>
          <Typography><strong>Tổng tiền:</strong> {order.totalAmount.toLocaleString()} VND</Typography>

          <Typography sx={{ mt: 2 }} variant="h6">Sản phẩm đã đặt</Typography>
          {order.items.map((item, index) => (
            <Box key={index} sx={{ borderBottom: '1px solid #ddd', py: 1 }}>
              <Typography><strong>Sản phẩm:</strong> {productNames[item.productId] || 'Đang tải...'}</Typography>
              <Typography><strong>Màu:</strong> {item.color || 'Không chọn'}</Typography>
              <Typography><strong>Size:</strong> {item.size}</Typography>
              <Typography><strong>Số lượng:</strong> {item.quantity}</Typography>
              <Typography><strong>Giá:</strong> {item.price.toLocaleString()} VND</Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography sx={{ mt: 3, color: 'red' }}>Không tìm thấy đơn hàng!</Typography>
      )}

      <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/home')}>
        Quay lại trang chủ
      </Button>
    </Box>
  )
}

export default OrderSuccess
