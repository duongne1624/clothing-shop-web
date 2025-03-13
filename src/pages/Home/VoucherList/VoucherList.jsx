import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import VoucherCard from './VoucherCard/VoucherCard'
import { couponApi } from '~/apis'
import { useEffect, useState } from 'react'
import { Box } from '@mui/material'

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
    <Paper sx={{
      display: 'flex',
      flexDirection: 'column',
      mt: 2,
      p: 2,
      alignItems: 'center',
      maxWidth: '100%'
    }}>
      <Typography variant='h6'>ƯU ĐÃI</Typography>
      <Typography
        sx={{
          textAlign: 'center',
          color: '#878787',
          fontStyle: 'italic',
          margin: 0,
          display: 'inline-block',
          paddingTop: '15px',
          position: 'relative',
          minWidth: '150px',
          '&::before': {
            content: '"///"',
            color: '#000',
            position: 'absolute',
            top: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '20px',
            textAlign: 'center',
            background: '#fff',
            zIndex: 9,
            fontSize: '14px'
          },
          '&::after': {
            content: '""',
            width: '120px',
            height: '1px',
            background: '#000',
            position: 'absolute',
            top: '5px',
            left: '15px'
          }
        }}
      />
      <Box sx={{
        width: '100%',
        display: 'flex',
        mt: 3,
        gap: 2,
        overflowX: 'auto',
        overflowY: 'hidden',
        pb: 2
      }}>
        {coupons.map((item, index) => (
          <VoucherCard key={index} voucher={item} />
        ))}
      </Box>
    </Paper>
  )
}

export default VoucherList
