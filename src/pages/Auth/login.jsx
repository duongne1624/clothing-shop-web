import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { TextField, Button, Box, Typography, Container, Paper, InputAdornment, IconButton, Divider } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '~/apis'
import { useDispatch, useSelector } from 'react-redux'
import { loginSuccess } from '~/redux/authSlide'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import GoogleIcon from '@mui/icons-material/Google'
import FacebookIcon from '@mui/icons-material/Facebook'
import { motion } from 'framer-motion'

const schema = yup.object().shape({
  username: yup.string().min(3, 'Username ít nhất 3 ký tự!').max(50, 'Username nhiều nhất 50 ký tự!').required('Vui lòng nhập username!'),
  password: yup.string().min(3, 'Mật khẩu ít nhất 3 ký tự!').required('Vui lòng nhập mật khẩu!')
})

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await authApi.login(data)
      dispatch(loginSuccess(response.user))

      var millisecondsToWait = 10
      await sleep(millisecondsToWait)

      const isAdmin = response.user.role === 'admin'
      if (isAdmin) {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    } catch (error) {
      if (error.message === 'Username not found!') {
        setError('username', { type: 'manual', message: 'Username không tồn tại' })
      } else if (error.message === 'Password not correct!') {
        setError('password', { type: 'manual', message: 'Mật khẩu không đúng' })
      } else {
        setError('username', { type: 'manual', message: 'Đã có lỗi xảy ra, vui lòng thử lại!' })
      }
    }
    setLoading(false)
  }

  async function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec))
  }

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4
    }}>
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                Chào mừng trở lại
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Đăng nhập để tiếp tục mua sắm
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Username"
                fullWidth
                margin="normal"
                {...register('username')}
                error={!!errors.username}
                helperText={errors.username?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1cb05c'
                    }
                  }
                }}
              />
              <TextField
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1cb05c'
                    }
                  }
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  background: '#1cb05c',
                  '&:hover': {
                    background: '#169c4f'
                  }
                }}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>

              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Chưa có tài khoản?{' '}
                  <Link to="/register" style={{ color: '#1cb05c', textDecoration: 'none', fontWeight: 600 }}>
                    Đăng ký ngay
                  </Link>
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  hoặc
                </Typography>
              </Divider>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  sx={{
                    borderColor: '#db4437',
                    color: '#db4437',
                    '&:hover': {
                      borderColor: '#db4437',
                      background: 'rgba(219, 68, 55, 0.04)'
                    }
                  }}
                >
                  Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FacebookIcon />}
                  sx={{
                    borderColor: '#4267B2',
                    color: '#4267B2',
                    '&:hover': {
                      borderColor: '#4267B2',
                      background: 'rgba(66, 103, 178, 0.04)'
                    }
                  }}
                >
                  Facebook
                </Button>
              </Box>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  )
}
