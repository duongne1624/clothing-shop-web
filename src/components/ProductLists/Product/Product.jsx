import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import Slide from '@mui/material/Slide'
import Dialog from '@mui/material/Dialog'


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

function Product() {
  const [openDetail, setOpenDetail] = React.useState(false)

  const handleCloseBackdrop = () => setOpenDetail(false)
  const handleOpenBackdrop = () => setOpenDetail(true)
  const handleClickProductDetail = () => {
    //setOpenDetail(true)
  }

  return (
    <Box sx={{
      maxWidth: 250,
      minWidth: 250,
      border: '1px solid black',
      borderRadius: '5px',
      display: 'flex',
      flexDirection: 'column',
      px: 1,
      py: 1,
      my: 1.5,
      gap: 1,
      '&:hover .actionBox': {
        transform: 'translateY(0%)',
        opacity: 1
      },
      '@media (max-width: 600px)': {
        '& .actionBox': {
          transform: 'translateY(0%)',
          opacity: 1
        }
      }
    }}>
      <Box sx={{ width: '100%', height: 200, overflow: 'hidden', position: 'relative' }}>
        <img
          src="/Images/Users/avartar-default.jpg"
          alt="product"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onClick={handleClickProductDetail}
        />

        {/* Action Box */}
        <Box className="actionBox" sx={{
          position: 'absolute',
          bottom: 10,
          left: '30%',
          transform: 'translateY(50%)',
          display: 'flex',
          gap: 1,
          backgroundColor: '#fff',
          borderRadius: '10px',
          padding: '5px',
          opacity: 0,
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          '@media (max-width: 600px)': {
            transform: 'translateY(0%)',
            opacity: 1
          }
        }}>
          <IconButton>
            <ShoppingCartOutlinedIcon color="primary" />
          </IconButton>
          <IconButton onClick={handleOpenBackdrop}>
            <VisibilityOutlinedIcon color="primary" />
          </IconButton>
        </Box>
      </Box>

      <Typography variant='h6'>Áo jean nam xanh</Typography>
      <Typography variant='body1' fontWeight='bold'>599,000đ</Typography>

      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
        {[...Array(2)].map((_, index) => (
          <Box key={index} sx={{ width: 35, borderRadius: '50%', overflow: 'hidden', cursor: 'pointer' }}>
            <img src="/Images/Users/avartar-default.jpg" alt='variant' style={{ width: '100%' }} />
          </Box>
        ))}
      </Box>

      {/*             Thông tin sản phẩm demo                */}
      <Dialog
        open={openDetail}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseBackdrop}
        aria-describedby="alert-dialog-slide-description"
      >
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2
        }}>
          {/*             Ảnh sản phẩm               */}
          <img
            src="/Images/Users/avartar-default.jpg"
            alt="product"
            style={{ width: '50%', height: '100%', objectFit: 'cover' }}
            onClick={handleClickProductDetail}
          />
          {/*             Thông tin sản phẩm               */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            {/*             Tên sản phẩm               */}
            <Typography variant='h6'>Áo jean nam xanh</Typography>

            {/*             SKU               */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 0.3,
              alignItems: 'center'
            }}>
              <Typography variant='subtitle1' fontWeight='bold'>SKU:</Typography>
              <Typography variant='subtitle1'>HDID0033-01</Typography>
            </Box>

            {/*             Giá bán               */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
              alignItems: 'center'
            }}>
              <Typography variant='body1' fontWeight='bold'>599,000₫</Typography>
              <Typography variant='subtitle1' sx={{ textDecoration: 'line-through', color: 'gray' }} >699.000₫</Typography>
            </Box>

            {/*             Màu sắc               */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.2
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 0.3,
                alignItems: 'center'
              }}>
                <Typography variant='subtitle1' fontWeight='bold'>Màu sắc:</Typography>
                <Typography variant='subtitle1'>Đen-0033</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                {[...Array(2)].map((_, index) => (
                  <Box key={index} sx={{ width: 35, borderRadius: '50%', overflow: 'hidden', cursor: 'pointer' }}>
                    <img src="/Images/Users/avartar-default.jpg" alt='variant' style={{ width: '100%' }} />
                  </Box>
                ))}
              </Box>
            </Box>
            {/*             Kích thước               */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.2
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 0.3,
                alignItems: 'center'
              }}>
                <Typography variant='subtitle1'>Kích thước:</Typography>
                <Typography variant='subtitle1' fontWeight='bold'>S</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                {[...Array(4)].map((_, index) => (
                  <Box key={index} sx={{
                    width: 35,
                    height: 35,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '1px solid black',
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex'
                  }}>
                    <Typography variant='body1'>S</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/*        Số lượng & thêm vào giỏ hàng        */}
            <Box>

            </Box>

            {/*        Link xem chi tiết sản phẩm        */}
            <Typography variant='body2' sx={{ textDecoration: 'underline', color: 'gray', cursor: 'pointer' }}>Xem chi tiết »</Typography>
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
}

export default Product
