import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import VoucherCard from './VoucherCard/VoucherCard'
import { allLabel } from '~/assets/js/infos'

function VoucherList() {
  const nameVoucher = allLabel.voucherLabel
  return (
    <Box sx={{
      gap: 1,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography variant="h4">{nameVoucher}</Typography>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        width: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
        py: 1.5
      }}>
        <VoucherCard voucherCode='XUAN50' />
        <VoucherCard voucherCode='XUAN60' />
        <VoucherCard voucherCode='XUAN70' />
      </Box>
    </Box>
  )
}

export default VoucherList
