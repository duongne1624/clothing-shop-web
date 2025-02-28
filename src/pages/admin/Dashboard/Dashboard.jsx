import { Box, Typography, Grid, Paper } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const data = [
  { name: 'Jan', orders: 40 },
  { name: 'Feb', orders: 55 },
  { name: 'Mar', orders: 78 },
  { name: 'Apr', orders: 60 },
  { name: 'May', orders: 90 }
]

export default function AdminDashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Thống kê
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
            <Typography variant="h6">Số đơn hàng hôm nay</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e88e5' }}>120</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fbe9e7' }}>
            <Typography variant="h6">Doanh thu hôm nay</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d84315' }}>15,000,000đ</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
            <Typography variant="h6">Khách hàng mới</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>35</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Thống kê đơn hàng theo tháng</Typography>
        <Paper sx={{ p: 2, mt: 2 }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#42a5f5" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  )
}
