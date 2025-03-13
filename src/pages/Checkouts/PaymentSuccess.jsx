import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import { showSnackbar } from '~/redux/snackbarSlice'
import { useDispatch } from 'react-redux'

function PaymentSuccess() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const status = searchParams.get('status')

    if (status === '1') {
      dispatch(showSnackbar({ message: 'Thanh toán thành công!', severity: 'success' }))
      navigate('/order-success')
    } else {
      dispatch(showSnackbar({ message: 'Thanh toán thất bại!', severity: 'error' }))
      navigate('/home')
    }
  }, [dispatch, navigate, searchParams])

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>Đang xử lý thanh toán...</Typography>
    </Box>
  )
}

export default PaymentSuccess
