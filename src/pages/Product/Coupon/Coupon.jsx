import { Box, Typography, Button } from '@mui/material'

function Coupon() {
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
        position: 'relative'
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: 1,
          width: '100%'
        }}>
          <Button variant='contained' size='medium' sx={{ minWidth: '120px' }}>CAPTAIN</Button>
          <Button variant='contained' size='medium' sx={{ minWidth: '120px' }}>WILSON</Button>
          <Button variant='contained' size='medium' sx={{ minWidth: '120px' }}>REDHULK</Button>
          <Button variant='contained' size='medium' sx={{ minWidth: '120px' }}>ROGERS</Button>

        </Box>
      </Box>
    </Box>
  )
}

export default Coupon