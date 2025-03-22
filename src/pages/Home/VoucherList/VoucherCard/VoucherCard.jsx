import { useDispatch } from 'react-redux'
import { showSnackbar } from '~/redux/snackbarSlice'
import { Box, Typography, Button, Paper } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useState } from 'react'

const VoucherCard = ({ voucher }) => {
  const dispatch = useDispatch()
  const [isCopied, setIsCopied] = useState(false)
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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(voucherCode)
    setIsCopied(true)
    dispatch(showSnackbar({ message: `Sao chép mã: ${voucherCode} thành công!`, severity: 'success' }))
    setTimeout(() => setIsCopied(false), 2000)
  }

  const getDiscountColor = (type) => {
    return type === 'percentage' ? '#e4393c' : '#00a650'
  }

  return (
    <Paper
      elevation={0}
      sx={{
        minWidth: '280px',
        maxWidth: '280px',
        height: 'auto',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderColor: getDiscountColor(voucher.type)
        }
      }}
    >
      {/* Ribbon */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: -30,
          backgroundColor: getDiscountColor(voucher.type),
          color: '#fff',
          padding: '4px 30px',
          transform: 'rotate(45deg)',
          fontSize: '12px',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {voucher.type === 'percentage' ? `${voucher.value}%` : 'GIẢM GIÁ'}
      </Box>

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
            VOUCHER
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            {voucher.type === 'percentage' 
              ? `Tối đa ${formatNumber(voucher.maxDiscount)}`
              : `Đơn từ ${formatNumber(voucher.minOrder)}`}
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'baseline', 
          mb: 2,
          gap: 0.5
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold',
              color: getDiscountColor(voucher.type)
            }}
          >
            {voucher.type === 'percentage' ? voucher.value : formatNumber(voucher.value)}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              color: getDiscountColor(voucher.type)
            }}
          >
            {voucher.type === 'percentage' ? '%' : 'đ'}
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: 1
        }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: '#666',
              flex: 1
            }}
          >
            Mã: <strong>{voucherCode}</strong>
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyCode}
            sx={{
              borderColor: getDiscountColor(voucher.type),
              color: getDiscountColor(voucher.type),
              '&:hover': {
                borderColor: getDiscountColor(voucher.type),
                backgroundColor: `${getDiscountColor(voucher.type)}10`
              }
            }}
          >
            {isCopied ? 'Đã sao chép!' : 'Sao chép'}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default VoucherCard
