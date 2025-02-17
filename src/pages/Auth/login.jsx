import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { TextField, Button, Box, Typography, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { authApi } from '~/apis'

const schema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ!').required('Vui lòng nhập email!'),
  password: yup.string().min(3, 'Mật khẩu ít nhất 3 ký tự!').required('Vui lòng nhập mật khẩu!')
})

export default function LoginPage() {
  const navigate = useNavigate()
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
      localStorage.setItem('token', response.token)
      navigate('/')
    } catch (error) {
      if (error.message === 'Email not found!') {
        setError('email', { type: 'manual', message: 'Email không tồn tại' })
      } else if (error.message === 'Password not corect!') {
        setError('password', { type: 'manual', message: 'Mật khẩu không đúng' })
      } else {
        setError('email', { type: 'manual', message: 'Đã có lỗi xảy ra, vui lòng thử lại!' })
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
      <Box sx={{ mt: 20, p: 6, boxShadow: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h4" mb={3}>Đăng Nhập</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
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
      </Box>
    </Container>
  )
}
