import { useState, useEffect } from 'react'
import { Box, TextField, Button, Typography, Divider, RadioGroup, FormControlLabel, Radio, Chip, Table, TableHead, TableBody, TableRow, TableCell, Badge } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import { showSnackbar } from '~/redux/snackbarSlice'
import { createOrder, getCouponByCode } from '~/apis'

const paymentMethods = [
  { id: 'cod', label: 'Thanh toán khi giao hàng (COD)', icon: 'https://hstatic.net/0/0/global/design/seller/image/payment/cod.svg?v=6' },
  { id: 'vnpay', label: 'Thanh toán VNPAY', icon: 'https://hstatic.net/0/0/global/design/seller/image/payment/vnpay_new.svg?v=6' },
  { id: 'zalopay', label: 'Ví ZaloPay', icon: 'https://simg.zalopay.com.vn/zlp-website/assets/new_logo_6c5db2d21b.svg' },
  { id: 'momo', label: 'Ví MoMo', icon: 'https://hstatic.net/0/0/global/design/seller/image/payment/momo.svg?v=6' }
]

function Checkouts() {
  const [userInfo, setUserInfo] = useState({ name: '', phone: '', address: '' })
  const [searchParams] = useSearchParams()
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [selectedMethod, setSelectedMethod] = useState('cod')
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const productId = searchParams.get('productId')
  const image = searchParams.get('image')
  const name = searchParams.get('name')
  const quantity = parseInt(searchParams.get('quantity')) || 1
  const size = searchParams.get('size')
  const encodedColor = searchParams.get('color')
  const price = parseInt(searchParams.get('price')) || 0

  let color = {}
  try {
    color = JSON.parse(decodeURIComponent(encodedColor || '{}'))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error parsing selectedColor:', error)
  }

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name,
        phone: user.phone,
        address: user.address
      })
    }
  }, [user])

  const originalPrice = quantity * price
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

  const handleCheckout = async (paymentMethod) => {
    const redirecturl = `${window.location.origin}/payment-success`

    const orderData = {
      userId: user?.id || null,
      name: userInfo?.name,
      phone: userInfo?.phone,
      address: userInfo?.address,
      items: [{
        productId: productId,
        quantity: quantity,
        size: size,
        color: color.name,
        price: price
      }],
      amount: originalPrice,
      discountCode: appliedCoupon || '',
      discountAmount: discountPrice || 0,
      lastAmount: totalPrice,
      paymentMethod: paymentMethod,
      redirecturl: redirecturl
    }

    const response = await createOrder(orderData)

    if (response.order.paymentInfo.return_code === 1) {
      dispatch(showSnackbar({ message: 'Tạo đơn hàng thành công!', severity: 'success' }))
      window.location.href = response.order.paymentInfo.order_url
    } else {
      dispatch(showSnackbar({ message: 'Tạo đơn hàng thất bại! Vui lòng chọn phương thức thanh toán khác', severity: 'error' }))
    }
  }

  function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return (
    <Box display="flex" justifyContent="space-between" padding={4}>
      <Box width="58%">
        <img src="/logo-web.png" alt='logo' width='100%' height='200px' />
        <Breadcrumbs name='Thanh toán' />
        <Typography variant="h6">Thông tin giao hàng</Typography>
        <TextField fullWidth label="Họ và tên" value={userInfo.name} onChange={e => setUserInfo({ ...userInfo, name: e.target.value })} sx={{ my: 1 }} />
        <TextField fullWidth label="Số điện thoại" value={userInfo.phone} onChange={e => setUserInfo({ ...userInfo, phone: e.target.value })} sx={{ my: 1 }} />
        <TextField fullWidth label="Địa chỉ" value={userInfo.address} onChange={e => setUserInfo({ ...userInfo, address: e.target.value })} sx={{ my: 1 }} />
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Phương thức thanh toán</Typography>
        <RadioGroup value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
          {paymentMethods.map((method) => (
            <FormControlLabel
              key={method.id}
              value={method.id}
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img src={method.icon} alt={method.label} width={24} height={24} />
                  {method.label}
                </Box>
              }
              sx={{ mb: 1, p: 1, borderRadius: 1, border: '1px solid #ddd', width: '100%' }}
            />
          ))}
        </RadioGroup>
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => handleCheckout(selectedMethod)}>
          Hoàn tất đơn hàng ({totalPrice.toLocaleString()}₫)
        </Button>
      </Box>

      <Box width="38%" bgcolor="#f5f5f5" p={3} borderRadius={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Thông tin</TableCell>
              <TableCell>Giá</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Badge badgeContent={quantity} color="secondary">
                  <img
                    src={image}
                    alt={name}
                    width="60"
                    height="60"
                    style={{ borderRadius: '10px' }}
                  />
                </Badge>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="black">
                  {name}
                </Typography>
                <Typography variant="body2">{color.name} / {size}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="black">
                  {formatCurrency(price * quantity)}₫
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />
        <Box display="flex" gap={1}>
          <TextField fullWidth placeholder="Nhập mã giảm giá" value={couponCode} onChange={e => setCouponCode(e.target.value)} size='small' />
          <Button variant="contained" onClick={handleApplyCoupon} disabled={!!appliedCoupon}>OK</Button>
        </Box>
        {appliedCoupon && <Chip label={`Mã: ${appliedCoupon} (-${discountPrice.toLocaleString()}₫)`} onDelete={() => { setDiscount(0); setAppliedCoupon(null) }} color="primary" sx={{ mt: 1 }} />}
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between">
          <Typography>Tạm tính:</Typography>
          <Typography>{originalPrice.toLocaleString()}₫</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography>Giá giảm:</Typography>
          <Typography>-{discountPrice.toLocaleString()}₫</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">Tổng cộng:</Typography>
          <Typography variant="h6">{totalPrice.toLocaleString()}₫</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Checkouts
