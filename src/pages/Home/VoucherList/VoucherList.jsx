import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

function VoucherList() {
  return (
    <Box sx={{
      gap: 1,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography variant="h4">Ưu đãi đầu xuân</Typography>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        width: '100%',
        overflowX: 'auto',
        overflowY: 'hidden'
      }}>
        <Box sx={{
          width: '35%',
          height: 'auto',
          overflow: 'hidden',
          borderRadius: 2,
          border: '1px solid black',
          px: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant='h6'>VOUCHER</Typography>
            <Typography align='center' variant='body1'>đơn từ 699K</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <Typography variant='h5' fontWeight='bold'>50.000</Typography>
            <Typography variant='subtitle1' fontWeight='bold'>VNĐ</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant='subtitle1'>Nhập mã: XUAN50</Typography>
            <Button>
              Sao chép
            </Button>
          </Box>
        </Box>
        <Box sx={{
          width: '35%',
          height: 'auto',
          overflow: 'hidden',
          borderRadius: 2,
          border: '1px solid black',
          px: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant='h6'>VOUCHER</Typography>
            <Typography align='center' variant='body1'>đơn từ 699K</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <Typography variant='h5' fontWeight='bold'>50.000</Typography>
            <Typography variant='subtitle1' fontWeight='bold'>VNĐ</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant='subtitle1'>Nhập mã: XUAN50</Typography>
            <Button>
              Sao chép
            </Button>
          </Box>
        </Box>
        <Box sx={{
          width: '35%',
          height: 'auto',
          overflow: 'hidden',
          borderRadius: 2,
          border: '1px solid black',
          px: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant='h6'>VOUCHER</Typography>
            <Typography align='center' variant='body1'>đơn từ 699K</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <Typography variant='h5' fontWeight='bold'>50.000</Typography>
            <Typography variant='subtitle1' fontWeight='bold'>VNĐ</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant='subtitle1'>Nhập mã: XUAN50</Typography>
            <Button>
              Sao chép
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default VoucherList