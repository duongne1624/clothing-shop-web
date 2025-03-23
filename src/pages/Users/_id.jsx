import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Paper, Typography, Avatar, Grid, Button, Divider, TextField } from '@mui/material'
import { motion } from 'framer-motion'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import { useNavigate } from 'react-router-dom'
import { userApi, orderApi } from '~/apis'
import { showSnackbar } from '~/redux/snackbarSlice'
import { loginSuccess } from '~/redux/authSlide'

const MotionBox = motion(Box)

function Profile() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = React.useState(false)
  const [loading, setLoading] = useState(false)
  const [orderStats, setOrderStats] = useState({
    pending: 0,
    completed: 0,
    shipping: 0
  })

  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    const fetchOrderStats = async () => {
      try {
        const orders = await orderApi.getOrderByUserId(user._id)
        const stats = {
          pending: orders.filter(order => order.status === 'pending').length,
          completed: orders.filter(order => order.status === 'completed').length,
          shipping: orders.filter(order => order.status === 'shipping').length
        }
        setOrderStats(stats)
      } catch (error) {
        console.error('Error fetching order stats:', error)
      }
    }

    fetchOrderStats()
  }, [user, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleClick = () => {
    if (isEditing) {
      handleSubmit()
    } else {
      setIsEditing(true)
    }
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    try {
      const result = await userApi.updateUser(user._id, formData)
      if (result.user.success !== true) return

      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      }

      dispatch(loginSuccess(updatedUser))
      dispatch(showSnackbar({
        message: 'Cập nhật thông tin thành công!',
        severity: 'success'
      }))
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      dispatch(showSnackbar({
        message: 'Có lỗi xảy ra khi cập nhật thông tin',
        severity: 'error'
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        py: 4,
        px: 2
      }}
    >
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: 'linear-gradient(45deg, #ffffff 30%, #f8f9fa 90%)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              Thông tin cá nhân
            </Typography>
            <Button
              variant={isEditing ? 'contained' : 'outlined'}
              startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
              onClick={handleClick}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              {isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa'}
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 150,
                    height: 150,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: '#1976d2'
                  }}
                >
                  <PersonIcon sx={{ fontSize: 100 }} />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {user?.name}
                </Typography>
                <Typography color="text.secondary">
                  Thành viên từ {new Date(user?.createdAt).toLocaleDateString('vi-VN')}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Địa chỉ"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      multiline
                      rows={3}
                      InputProps={{
                        startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
              Thống kê đơn hàng
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                  <Typography variant="h4" color="primary">{orderStats.pending}</Typography>
                  <Typography color="text.secondary">Đơn hàng đang chờ</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
                  <Typography variant="h4" color="success.main">{orderStats.completed}</Typography>
                  <Typography color="text.secondary">Đơn hàng hoàn thành</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
                  <Typography variant="h4" color="warning.main">{orderStats.shipping}</Typography>
                  <Typography color="text.secondary">Đơn hàng đang giao</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </MotionBox>
  )
}

export default Profile
