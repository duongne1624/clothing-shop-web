import { Box, Container, Typography, Link, Grid } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { subscribeEmail } from '~/apis'
import { showSnackbar } from '~/redux/snackbarSlice'

function Footer() {
  const [subscriberEmail, setSubscriberEmail] = useState()
  const dispatch = useDispatch()

  const subscribe = async () => {
    try {
      const result = await subscribeEmail(subscriberEmail)
      dispatch(showSnackbar({ message: result.message, severity: 'success' }))
    } catch (error) {
      dispatch(showSnackbar({ message: error.response.data.message, severity: 'error' }))
    }
  }

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.footer',
        color: 'text.primary',
        py: 3,
        mt: 0,
        boxShadow: '0 1px 5px 2px rgba(0, 0, 0, 0.15)'
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Về Chúng Tôi
            </Typography>
            <Link href="#" color="inherit" display="block" sx={{ textDecoration: 'none' }}>
              Giới Thiệu
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ textDecoration: 'none' }}>
              Liên Hệ
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ textDecoration: 'none' }}>
              Câu Hỏi Thường Gặp
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Dịch Vụ
            </Typography>
            <Link href="#" color="inherit" display="block" sx={{ textDecoration: 'none' }}>
              Giao Hàng
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ textDecoration: 'none' }}>
              Đổi Trả
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ textDecoration: 'none' }}>
              Chính Sách Bảo Hành
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Kết Nối
            </Typography>
            <Link href="#" color="inherit" display="block" sx={{ textDecoration: 'none' }}>
              Facebook
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ textDecoration: 'none' }}>
              Instagram
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ textDecoration: 'none' }}>
              Twitter
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Đăng Ký Nhận Thông Báo
            </Typography>
            <input
              type="email"
              onChange={(e) => setSubscriberEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
            <button
              onClick={subscribe}
              style={{
                marginTop: '8px',
                width: '100%',
                padding: '8px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Đăng Ký
            </button>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} Công Ty ABC. Tất cả các quyền được bảo lưu.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
