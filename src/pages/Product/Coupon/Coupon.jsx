import { useDispatch } from 'react-redux'
import { showSnackbar } from '~/redux/snackbarSlice'
import { Box, Typography, Button } from '@mui/material'

function Coupon({ coupons }) {
  const dispatch = useDispatch()

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

  const handleCopyCode = (voucherCode) => {
    const textArea = document.createElement('textarea')
    textArea.value = voucherCode
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    dispatch(showSnackbar({ message: `Sao chép mã: ${voucherCode} thành công!`, severity: 'success' }))
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }}>
      {/*        Khung khuyến mãi        */}
      <Box sx={{
        p: '18px 15px 15px 15px',
        border: '1.8px dashed #000000',
        marginTop: '25px',
        position: 'relative',
        zIndex: 100
      }}>
        <Box sx={{
          position:'absolute',
          top:'-18px',
          backgroundColor: '#ffffff',
          display: 'flex',
          gap: 1,
          p: 1
        }}>
          <img src='https://file.hstatic.net/1000253775/file/gift_new-removebg-preview_fce03d3cd9d24d0cb0be33ac068e41fc.png' width='22px' height='22px' />
          <Typography fontWeight='bold'>KHUYẾN MÃI - ƯU ĐÃI</Typography>
        </Box>
        <Typography>Mua có ĐÔI - Giá YÊU thôi ♥️</Typography>
        <Typography>Mua càng nhiều ưu đãi càng lớn - SIUUUUUUUUUUUUUUUUUUUUU ♥️</Typography>
        {coupons.map((item, index) => {
          if (item.type === 'percentage') (
            <Typography key={index}>Nhập mã <strong>{item.code}</strong> GIẢM {item.value}% TỐI ĐA {formatNumber(item.maxDiscount)}</Typography>
          )
          else (
            <Typography key={index}>Nhập mã <strong>{item.code}</strong> GIẢM {formatNumber(item.value)} ĐƠN TỪ {formatNumber(item.minOrder)}</Typography>
          )
        })}
      </Box>
      {/*        Danh sách ưu đãi - sao chép        */}
      <Box sx={
        {
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          width: '100%'
        }
      }>
        <Typography>Mã giảm giá bạn có thể sử dụng:</Typography>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 1,
          width: '100%'
        }}>
          {coupons.map((item, index) => (
            <Button key={index} onClick={() => handleCopyCode(item.code)} variant='contained' size='medium' sx={{ minWidth: '120px' }}>{item.code}</Button>
          ))}

        </Box>
      </Box>
    </Box>
  )
}

export default Coupon