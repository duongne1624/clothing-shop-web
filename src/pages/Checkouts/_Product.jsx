import { useState, useEffect } from 'react'
import { Box, TextField, Button, Typography, Divider, RadioGroup, FormControlLabel, Radio, Chip, Table, TableHead, TableBody, TableRow, TableCell, Badge, Card, CardContent, MenuItem } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { showSnackbar } from '~/redux/snackbarSlice'
import { createOrder, getCouponByCode } from '~/apis'
import { API_ROOT } from '~/utils/constants'
import CheckoutLayout from '~/components/CheckoutLayout/CheckoutLayout'
import { motion } from 'framer-motion'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PaymentIcon from '@mui/icons-material/Payment'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import axios from 'axios'

const MotionCard = motion(Card)

const paymentMethods = [
  { id: 'cod', label: 'Thanh toán khi giao hàng (COD)', icon: 'https://hstatic.net/0/0/global/design/seller/image/payment/cod.svg?v=6' },
  { id: 'zalopay', label: 'Ví ZaloPay', icon: 'https://simg.zalopay.com.vn/zlp-website/assets/new_logo_6c5db2d21b.svg' },
  { id: 'vnpay', label: 'Thanh toán VNPAY', icon: 'https://hstatic.net/0/0/global/design/seller/image/payment/vnpay_new.svg?v=6' },
  { id: 'momo', label: 'Ví MoMo', icon: 'https://hstatic.net/0/0/global/design/seller/image/payment/momo.svg?v=6' }
]

function Checkouts() {
  const [userInfo, setUserInfo] = useState({ name: '', phone: '', address: '', email: '' })
  const [searchParams] = useSearchParams()
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [selectedMethod, setSelectedMethod] = useState('cod')
  const [provinces, setProvinces] = useState([])
  const [province, setProvince] = useState('')
  const [districts, setDistricts] = useState([])
  const [district, setDistrict] = useState('')
  const [wards, setWards] = useState([])
  const [ward, setWard] = useState('')

  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()

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

  const fetchProvinces = async () => {
    const response = await axios.get('https://provinces.open-api.vn/api/p/')
    setProvinces(response.data)
  }

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name,
        phone: user.phone,
        email: user.email
      })
    }
    fetchProvinces()
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
      dispatch(showSnackbar({ message: 'Mã giảm giá không tồn tại!', severity: 'error' }))
    }
  }

  const handleCheckout = async (paymentMethod) => {

    if (!userInfo.name || userInfo.name.trim().length === 0) {
      dispatch(showSnackbar({ message: 'Tên không được để trống!', severity: 'error' }))
      return
    }

    if (!userInfo.phone || userInfo.phone.trim().length === 0) {
      dispatch(showSnackbar({ message: 'Số điện thoại không được để trống!', severity: 'error' }))
      return
    }

    if (!userInfo.email || userInfo.email.trim().length === 0) {
      dispatch(showSnackbar({ message: 'Email không được để trống!', severity: 'error' }))
      return
    }

    if (!userInfo.email.includes('@')) {
      dispatch(showSnackbar({ message: 'Email không đúng định dạng!', severity: 'error' }))
      return
    }

    if (!province.name || province.name.trim().length === 0) {
      dispatch(showSnackbar({ message: 'Vui lòng chọn tỉnh', severity: 'error' }))
      return
    }

    if (!district.name || district.name.trim().length === 0) {
      dispatch(showSnackbar({ message: 'Vui lòng chọn quận/huyện', severity: 'error' }))
      return
    }

    if (!ward.name || ward.name.trim().length === 0) {
      dispatch(showSnackbar({ message: 'Vui lòng chọn Xã', severity: 'error' }))
      return
    }

    if (!userInfo.address || userInfo.address.trim().length === 0) {
      dispatch(showSnackbar({ message: 'Địa chỉ không được để trống!', severity: 'error' }))
      return
    }

    if (paymentMethod === 'momo') {
      dispatch(showSnackbar({ message: 'Chức năng này đang phát triển!', severity: 'info' }))
      return
    }

    const address = `${userInfo.address}, ${ward.name}, ${district.name}, ${province.name}`

    const redirecturl = `${window.location.origin}/payment-success`

    const orderData = {
      userId: user?._id || null,
      name: userInfo?.name,
      phone: userInfo?.phone,
      email: userInfo?.email,
      address: address,
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

    let response = ''
    try {
      response = await createOrder(orderData)
    } catch (error) {
      dispatch(showSnackbar({ message: error.response.data.message, severity: 'warning' }))
      return
    }

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

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return ''
    const url = String(imageUrl)
    if (url.startsWith('http')) return url
    return `${API_ROOT}${url}`
  }

  const handleChangeProvince = async (e) => {
    const provinceResponse = await axios.get(`https://provinces.open-api.vn/api/p/${e.target.value}`)
    setProvince(provinceResponse.data)

    const response = await axios.get('https://provinces.open-api.vn/api/d/')

    const filteredDistricts = response.data.filter(district => district.province_code === parseInt(e.target.value))

    setDistricts(filteredDistricts)
    setDistrict(filteredDistricts[0])
    setWards([])
    setWard({})
  }

  const handleChangeDistrict = async (e) => {
    const districtResponse = await axios.get(`https://provinces.open-api.vn/api/d/${e.target.value}`)
    setDistrict(districtResponse.data)

    const response = await axios.get('https://provinces.open-api.vn/api/w/')

    const filteredWards = response.data.filter(ward => ward.district_code === parseInt(e.target.value))

    setWards(filteredWards)
    setWard(filteredWards[0])
  }

  return (
    <CheckoutLayout title="Thanh toán sản phẩm">
      <Box width={{ xs: '100%', md: '58%' }}>
        <MotionCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ mb: 3 }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
              <LocationOnIcon /> Thông tin giao hàng
            </Typography>
            <TextField
              fullWidth
              label="Họ và tên"
              value={userInfo.name}
              onChange={e => setUserInfo({ ...userInfo, name: e.target.value })}
              sx={{ my: 1 }}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              value={userInfo.phone}
              onChange={e => setUserInfo({ ...userInfo, phone: e.target.value })}
              sx={{ my: 1 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={userInfo.email}
              onChange={e => setUserInfo({ ...userInfo, email: e.target.value })}
              sx={{ my: 1 }}
            />
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <TextField
                select
                label="Tỉnh"
                value={province.code}
                sx={{ my: 1, width: '30%' }}
                onChange={(e) => handleChangeProvince(e)}
              >
                {provinces.map(province => (
                  <MenuItem key={province.code} value={province.code}>{province.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Quận/huyện"
                value={district.code}
                sx={{ my: 1, width: '30%' }}
                onChange={(e) => handleChangeDistrict(e)}
              >
                {districts.map(district => (
                  <MenuItem key={district.code} value={district.code}>{district.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label='Xã'
                value={ward.code}
                sx={{ my: 1, width: '30%' }}
                onChange={(e) => setWard(e.target.value)}
              >
                {wards.map(ward => (
                  <MenuItem key={ward.code} value={ward}>{ward.name}</MenuItem>
                ))}
              </TextField>
            </Box>
            <TextField
              fullWidth
              label="Địa chỉ (số nhà, tên đường)"
              value={userInfo.address}
              onChange={e => setUserInfo({ ...userInfo, address: e.target.value })}
              sx={{ my: 1 }}
            />
          </CardContent>
        </MotionCard>

        <MotionCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
              <PaymentIcon /> Phương thức thanh toán
            </Typography>
            <RadioGroup value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
              {paymentMethods.map((method) => (
                <FormControlLabel
                  key={method.id}
                  value={method.id}
                  control={<Radio />}
                  label={
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}>
                      <img src={method.icon} alt={method.label} width={24} height={24} />
                      {method.label}
                    </Box>
                  }
                  sx={{
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    border: '1px solid #ddd',
                    width: '100%',
                    '&:hover': {
                      borderColor: '#1976d2'
                    }
                  }}
                />
              ))}
            </RadioGroup>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.3)'
                }
              }}
              onClick={() => handleCheckout(selectedMethod)}
            >
              Hoàn tất đơn hàng ({totalPrice.toLocaleString()}₫)
            </Button>
          </CardContent>
        </MotionCard>
      </Box>

      <Box width={{ xs: '100%', md: '38%' }}>
        <MotionCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
              <ShoppingCartIcon /> Chi tiết đơn hàng
            </Typography>
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
                        src={getImageUrl(image)}
                        alt={name}
                        width="60"
                        height="60"
                        style={{
                          borderRadius: '10px',
                          objectFit: 'cover',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      />
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="black" sx={{ fontWeight: 500 }}>
                      {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {color.name} / {size}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(price * quantity)}₫
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                <LocalOfferIcon /> Mã giảm giá
              </Typography>
              <Box display="flex" gap={1}>
                <TextField
                  fullWidth
                  placeholder="Nhập mã giảm giá"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  size='small'
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleApplyCoupon}
                  disabled={!!appliedCoupon}
                  sx={{ borderRadius: 2 }}
                >
                  OK
                </Button>
              </Box>
              {appliedCoupon && (
                <Chip
                  label={`Mã: ${appliedCoupon} (-${discountPrice.toLocaleString()}₫)`}
                  onDelete={() => { setDiscount(0); setAppliedCoupon(null) }}
                  color="primary"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{
              bgcolor: '#f8f9fa',
              p: 3,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography>Tạm tính:</Typography>
                <Typography>{originalPrice.toLocaleString()}₫</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography>Giá giảm:</Typography>
                <Typography color="error">-{discountPrice.toLocaleString()}₫</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" color="primary">Tổng cộng:</Typography>
                <Typography variant="h6" color="primary">{totalPrice.toLocaleString()}₫</Typography>
              </Box>
            </Box>
          </CardContent>
        </MotionCard>
      </Box>
    </CheckoutLayout>
  )
}

export default Checkouts
