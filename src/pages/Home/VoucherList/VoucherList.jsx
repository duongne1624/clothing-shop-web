import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import VoucherCard from './VoucherCard/VoucherCard'
import { couponApi } from '~/apis'
import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'

function VoucherList() {
  const [coupons, setCoupons] = useState([])
  useEffect(() => {
    couponApi.getCoupons()
      .then((coupons) => {
        setCoupons(coupons)
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e)
      })
  }, [])

  return (
    <Paper 
      elevation={0}
      sx={{ 
        mt: 4, 
        p: 3, 
        bgcolor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}
    >
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2 
      }}>
        <LocalOfferIcon sx={{ color: '#e4393c', fontSize: 28 }} />
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600,
            color: '#333',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: '40px',
              height: '3px',
              backgroundColor: '#e4393c',
              borderRadius: '2px'
            }
          }}
        >
          Ưu đãi hấp dẫn
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#666',
            mt: 1
          }}
        >
          Áp dụng cho đơn hàng đầu tiên
        </Typography>
      </Box>

      <Box sx={{
        width: '100%',
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        overflowY: 'hidden',
        pb: 2,
        '&::-webkit-scrollbar': {
          height: '8px'
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px'
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
          '&:hover': {
            background: '#555'
          }
        }
      }}>
        {coupons.map((item, index) => (
          <VoucherCard key={index} voucher={item} />
        ))}
      </Box>
    </Paper>
  )
}

export default VoucherList
