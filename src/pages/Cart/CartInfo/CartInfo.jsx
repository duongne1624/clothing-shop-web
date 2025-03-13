import { Box, Paper, Typography, TextField, Button, Chip } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { showSnackbar } from '~/redux/snackbarSlice'
import { getCouponByCode } from '~/apis'
import CartItem from './CartItem/CartItem'
import ReplyIcon from '@mui/icons-material/Reply'

function CartInfo() {
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const cart = useSelector(state => state.cart.cart)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const originalPrice = cart.reduce((total, product) => total + product.price * product.quantity, 0)
  const discountPrice = appliedCoupon ? discount : 0
  const totalPrice = originalPrice - discountPrice

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      dispatch(showSnackbar({ message: 'Vui lòng nhập mã giảm giá!', severity: 'warning' }))
      return
    }

    try {
      const data = await getCouponByCode(couponCode)

      if (data.coupon) {
        const coupon = data.coupon

        if (coupon.type === 'percentage') {
          const discountAmount = (originalPrice * coupon.value) / 100
          setDiscount(Math.min(discountAmount, coupon.maxDiscount))
        } else if (coupon.type === 'fixed' && originalPrice >= coupon.minOrder) {
          setDiscount(coupon.value)
        } else {
          dispatch(showSnackbar({ message: 'Không đủ điều kiện áp dụng mã!', severity: 'error' }))
          return
        }

        setAppliedCoupon(couponCode.toUpperCase())
        dispatch(showSnackbar({ message: `Áp dụng mã giảm giá ${coupon.code} thành công!`, severity: 'success' }))
      } else {
        dispatch(showSnackbar({ message: 'Mã giảm giá không hợp lệ!', severity: 'error' }))
      }
    } catch (error) {
      dispatch(showSnackbar({ message: `Lỗi khi kiểm tra mã giảm giá! ${error}`, severity: 'error' }))
    }
  }

  const handleRemoveCoupon = () => {
    setDiscount(0)
    setAppliedCoupon(null)
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: {
        lg: 'row',
        xs: 'column'
      },
      justifyContent: 'space-between',
      gap: 2
    }}>
      {/* Sản phẩm trong giỏ hàng */}
      <Paper sx={{
        width: {
          lg:'58%',
          xs: '100%'
        },
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: 'fit-content',
        gap: 2
      }}>
        <Box sx={{
          width: '100%',
          display: 'flex',
          justifyContent:'space-between'
        }}>
          <Typography variant='h6'>Giỏ hàng:</Typography>
          <Typography sx={{ textDecoration: 'underline' }}>{cart.length} sản phẩm</Typography>
        </Box>

        {cart.length < 1 ? (
          <Typography>Giỏ hàng của bạn đang trống. Mời bạn mua thêm sản phẩm <strong style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>tại đây</strong>.</Typography>
        ) : (
          cart.map((product) => (
            <CartItem key={product.id} product={product} />
          ))
        )}
      </Paper>

      {/* Thông tin đơn hàng */}
      <Paper sx={{
        width: {
          lg:'40%',
          xs: '100%'
        },
        height: 'fit-content',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 1
      }}>
        <Typography variant='h6'>Thông tin đơn hàng</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant='body1'>Tạm tính:</Typography>
          <Typography variant='body1'>{formatCurrency(originalPrice)}₫</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant='body1'>Giá giảm:</Typography>
          <Typography variant='body1'>{formatCurrency(discountPrice)}₫</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant='body1'>Tổng tiền:</Typography>
          <Typography variant='body1' fontWeight='bold'>{formatCurrency(totalPrice)}₫</Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          width: '100%',
          gap: 1,
          height: '38px'
        }}>
          <TextField
            id="couponcode"
            placeholder="Nhập mã khuyến mãi (nếu có)"
            fullWidth
            variant="outlined"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            size='small'
          />
          <Button
            variant="contained"
            onClick={handleApplyCoupon}
            disabled={!!appliedCoupon}
          >
            OK
          </Button>
        </Box>

        {appliedCoupon && (
          <Chip
            label={`Đã áp dụng: ${appliedCoupon} (-${formatCurrency(discountPrice)}₫)`}
            onDelete={handleRemoveCoupon}
            color="primary"
          />
        )}
        <Button variant="contained"
          onClick={() => navigate('/checkouts/cart')}
          sx={{
            width: '100%',
            mt: 2
          }}>THANH TOÁN NGAY</Button>

        <Box
          onClick={() => navigate('/home')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyItems: 'center',
            m: '0 auto',
            cursor: 'pointer',
            '&:hover': {
              color: '#ffa53c'
            }
          }}>
          <ReplyIcon />
          <Typography fontSize={14}>Tiếp tục mua hàng</Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default CartInfo
