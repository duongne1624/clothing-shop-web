import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { TextField, Button, Box, Typography, Container } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '~/apis'
import { useDispatch, useSelector } from 'react-redux'
import { loginSuccess } from '~/redux/authSlide'

const schema = yup.object().shape({
  username: yup.string().min(3, 'Username ít nhất 3 ký tự!').max(50, 'Username nhiều nhất 50 ký tự!').required('Vui lòng nhập username!'),
  password: yup.string().min(3, 'Mật khẩu ít nhất 3 ký tự!').required('Vui lòng nhập mật khẩu!')
})

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    resolver: yupResolver(schema)
  })

  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await authApi.login(data)
      dispatch(loginSuccess(response.user))

      if (response.user.role === 'admin') {
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

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 20, p: 6, boxShadow: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h4" mb={3}>Đăng Nhập</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                border: '1px solid black !important'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: '1px solid black !important'
              },
              '& fieldset': {
                border: '1px solid black !important'
              }
            }}
          />
          <TextField
            label="Mật khẩu"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                border: '1px solid black !important'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: '1px solid black !important'
              },
              '& fieldset': {
                border: '1px solid black !important'
              }
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>
        <Typography mt={2}>
          Chưa có tài khoản?{'   '}
          <Link to="/register" style={{ textDecoration: 'none', color: '#1cb05c' }}>
            Đăng ký ngay
          </Link>
        </Typography>
      </Box>
    </Container>
  )
}
