import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Typography, Button, Snackbar } from '@mui/material'

function Coupon() {
  const [openSnackbar, setOpenSnackbar] = React.useState(false)

  //Hành động để tắt Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  const code = [
    'CAPTAIN',
    'WILSON',
    'REDHULK',
    'ROGERS'
  ]

  //Phương thức copy Voucher code
  const handleCopyCode = (voucherCode) => {
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
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }}>
      {/*        Khung khuyến mãi        */}
      <Box sx={{
        p: '18px 15px 15px 15px',
        border: '1.8px dashed #000000', //'2px solid #FF0000'
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
        <Typography display='flex'>Mua 2 sản phẩm thuộc nhóm, nhập mã VALENTINE giảm ngay 14% Xem ngay</Typography>
        <Typography>Nhập mã <strong>CAPTAIN</strong> GIẢM 10% TỐI ĐA 10K</Typography>
        <Typography>Nhập mã WILSON GIẢM 50K ĐƠN TỪ 699K</Typography>
        <Typography>Nhập mã REDHULK GIẢM 80K ĐỜN TỪ 999K</Typography>
        <Typography>Nhập mã ROGERS GIẢM 200K ĐỜN TỪ 1999K</Typography>
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
          {code.map((item, index) => (
            <Button key={index} onClick={() => handleCopyCode(item)} variant='contained' size='medium' sx={{ minWidth: '120px' }}>{item}</Button>
          ))}

        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        message={'Sao chép thành công!'}
        action={action}
      />
    </Box>
  )
}

export default Coupon