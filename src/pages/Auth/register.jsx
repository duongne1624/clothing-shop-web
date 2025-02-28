import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { TextField, Button, Box, Typography, Container } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '~/apis'
import { useDispatch } from 'react-redux'
import { showSnackbar } from '~/redux/snackbarSlice'

const schema = yup.object().shape({
  name: yup.string().min(3, 'Tên ít nhất 3 ký tự!').max(50, 'Tên nhiều nhất 50 ký tự!').required('Vui lòng nhập tên!'),
  username: yup.string().min(3, 'Username ít nhất 3 ký tự!').max(50, 'Username nhiều nhất 50 ký tự!').required('Vui lòng nhập username!'),
  email: yup.string().email('Email không hợp lệ!').required('Vui lòng nhập email!'),
  password: yup.string().min(6, 'Mật khẩu ít nhất 6 ký tự!').required('Vui lòng nhập mật khẩu!'),
  phone: yup.string().matches(/^0\d{9}$/, 'Số điện thoại không hợp lệ!').required('Vui lòng nhập số điện thoại!')
})

export default function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({ resolver: yupResolver(schema) })

  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await authApi.register(data)
      dispatch(showSnackbar({ message: 'Đăng ký tài khoản thành công!', severity: 'success' }))
      navigate('/login')
    } catch (error) {
      if (error.message.includes('Username already exists')) {
        setError('username', { type: 'manual', message: 'Username đã tồn tại!' })
      } else if (error.message.includes('Email already exists')) {
        setError('email', { type: 'manual', message: 'Email đã được sử dụng!' })
      } else {
        setError('username', { type: 'manual', message: 'Đã có lỗi xảy ra, vui lòng thử lại!' })
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/')
    }
  }, [navigate])

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 15, p: 6, boxShadow: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h4" mb={3}>Đăng Ký</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Họ và Tên"
            fullWidth
            margin="normal"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Mật khẩu"
            type="password"
            fullWidth
            margin="normal"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            margin="normal"
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>
        <Typography mt={2}>
          Đã có tài khoản?{'   '}
          <Link to="/login" style={{ textDecoration: 'none', color: '#1cb05c' }}>
            Đăng nhập ngay
          </Link>
        </Typography>
      </Box>
    </Container>
  )
}
