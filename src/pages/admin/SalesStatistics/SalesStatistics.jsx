// frontend/components/SalesStatistics.js
import { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Grid, CircularProgress, Box } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'
import dayjs from 'dayjs'
import axios from 'axios'

const SalesStatistics = () => {
  const [loading, setLoading] = useState(true)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [categorySales, setCategorySales] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [dateRange, setDateRange] = useState([dayjs().subtract(1, 'month'), dayjs()])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [startDate, endDate] = dateRange
        const revenueRes = await axios.get(`http://localhost:8017/v1/stats/revenue?startDate=${startDate}&endDate=${endDate}`)
        const categoryRes = await axios.get(`http://localhost:8017/v1/stats/category-sales?startDate=${startDate}&endDate=${endDate}`)
        const topProductsRes = await axios.get(`http://localhost:8017/v1/stats/top-products?startDate=${startDate}&endDate=${endDate}`)

        setTotalRevenue(revenueRes.data.totalRevenue)
        setCategorySales(
          Object.entries(categoryRes.data.salesByCategory).map(([category, sales]) => ({ category, sales }))
        )
        setTopProducts(topProductsRes.data.topProducts)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Lỗi khi tải dữ liệu thống kê:', error)
      }
      setLoading(false)
    }
    fetchData()
  }, [dateRange])

  if (loading) {
    return <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      justifyItems: 'center'
    }}>
      <CircularProgress sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignSelf: 'center'
      }} />
    </Box>
  }

  const formatNumber = (value) => {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + 'T'
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'Tr'
    if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K'
    return value.toString()
  }

  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      {/* Bộ chọn ngày */}
      <Box sx={{ p: 2, width: '100%' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateRangePicker
            value={dateRange}
            onChange={(newValue) => setDateRange(newValue)}
            disableFuture
          />
        </LocalizationProvider>
      </Box>

      {/* Tổng doanh thu */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Tổng Doanh Thu</Typography>
            <Typography variant="h4" color="primary">{totalRevenue?.toLocaleString()} VNĐ</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Doanh số theo danh mục */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6">Doanh Số Theo Danh Mục</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categorySales}>
                <XAxis dataKey="category" />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip formatter={(value) => formatNumber(value)} />
                <Bar dataKey="sales" fill="#47b9ff">
                  <LabelList dataKey="sales" position="top" formatter={formatNumber} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Sản phẩm bán chạy */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Sản Phẩm Bán Chạy</Typography>
            {topProducts.map((product, index) => (
              <Typography key={product.productId}>{index + 1}. Sản phẩm: <strong>{product.name}</strong> - Đã bán: <strong>{product.sold}</strong> sản phẩm</Typography>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SalesStatistics
