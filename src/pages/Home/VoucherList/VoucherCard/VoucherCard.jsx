import * as React from 'react'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Typography, Button } from '@mui/material'

const VoucherCard = ({ voucherCode }) => {
  const [openSnackbar, setOpenSnackbar] = React.useState(false)

  //Hành động để tắt Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenSnackbar(false)
  }

  //Phương thức copy Voucher code
  const handleCopyCode = () => {
    const textArea = document.createElement('textarea')
    textArea.value = voucherCode
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    setOpenSnackbar(true)
  }

  //Hành động khi bật Snackbar
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  )

  return (
    <Box sx={{
      minWidth: '250px',
      maxWidth: '250px',
      height: 'auto',
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
        <Typography variant='subtitle1'>Nhập mã: {voucherCode}</Typography>
        <Button onClick={handleCopyCode}>
          Sao chép
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        message={'Sao chép thành công mã: ' + voucherCode}
        action={action}
      />
    </Box>
  )
}

export default VoucherCard
