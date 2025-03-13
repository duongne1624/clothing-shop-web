import { useDispatch } from 'react-redux'
import { showSnackbar } from '~/redux/snackbarSlice'
import { Box, Typography, Button } from '@mui/material'

const VoucherCard = ({ voucher }) => {
  const dispatch = useDispatch()
  const voucherCode = voucher.code

  function formatNumber(num) {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + ' Tỷ'
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' Tr'
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + ' K'
    }
    return num.toString()
  }

  //Phương thức copy Voucher code
  const handleCopyCode = () => {
    const textArea = document.createElement('textarea')
    textArea.value = voucherCode
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    dispatch(showSnackbar({ message: `Sao chép mã: ${voucherCode} thành công!`, severity: 'success' }))
  }

  if (voucher.type === 'percentage') return (
    <Box sx={{
      minWidth: '260px',
      maxWidth: '260px',
      height: 'auto',
      borderRadius: 2,
      border: '1px solid black',
      px: 2
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='h6'>VOUCHER</Typography>
        <Typography align='center' variant='body1'>tối đa {formatNumber(voucher.maxDiscount)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'end' }}>
        <Typography variant='h5' fontWeight='bold'>{voucher.value}</Typography>
        <Typography variant='subtitle1' fontWeight='bold'>%</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='subtitle1'>Nhập mã: <strong>{voucherCode}</strong></Typography>
        <Button onClick={handleCopyCode}>
          Sao chép
        </Button>
      </Box>
    </Box>
  )
  else return (
    <Box sx={{
      minWidth: '260px',
      maxWidth: '260px',
      height: 'auto',
      borderRadius: 2,
      border: '1px solid black',
      px: 2
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='h6'>VOUCHER</Typography>
        <Typography align='center' variant='body1'>đơn từ {formatNumber(voucher.minOrder)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'end' }}>
        <Typography variant='h5' fontWeight='bold'>{voucher.value}</Typography>
        <Typography variant='subtitle1' fontWeight='bold'>VNĐ</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='subtitle1'>Nhập mã: <strong>{voucherCode}</strong></Typography>
        <Button onClick={handleCopyCode}>
          Sao chép
        </Button>
      </Box>
    </Box>
  )
}

export default VoucherCard
