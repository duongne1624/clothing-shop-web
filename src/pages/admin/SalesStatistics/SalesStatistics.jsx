// frontend/components/SalesStatistics.js
import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Paper,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LabelList, CartesianGrid } from 'recharts'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'
import dayjs from 'dayjs'
import { API_ROOT } from '~/utils/constants'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CategoryIcon from '@mui/icons-material/Category'
import InventoryIcon from '@mui/icons-material/Inventory'
import RefreshIcon from '@mui/icons-material/Refresh'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { showSnackbar } from '~/redux/snackbarSlice'

const MotionCard = motion(Card)

const SalesStatistics = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [categorySales, setCategorySales] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [dateRange, setDateRange] = useState([dayjs().subtract(1, 'month'), dayjs()])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchData()
  }, [dateRange, refreshKey])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [startDate, endDate] = dateRange
      const [revenueRes, categoryRes, topProductsRes] = await Promise.all([
        fetch(`${API_ROOT}/v1/stats/revenue?startDate=${startDate}&endDate=${endDate}`).then(res => res.json()),
        fetch(`${API_ROOT}/v1/stats/category-sales?startDate=${startDate}&endDate=${endDate}`).then(res => res.json()),
        fetch(`${API_ROOT}/v1/stats/top-products?startDate=${startDate}&endDate=${endDate}`).then(res => res.json())
      ])

      setTotalRevenue(revenueRes.totalRevenue)
      setCategorySales(
        Object.entries(categoryRes.salesByCategory).map(([category, sales]) => ({ category, sales }))
      )
      setTopProducts(topProductsRes.topProducts)
    } catch (error) {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi tải dữ liệu thống kê!', severity: 'error' }))
    }
    setLoading(false)
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const formatNumber = (value) => {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + 'T'
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'Tr'
    if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K'
    return value.toString()
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value)
  }

  if (loading) {
    return (
      <Box sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Thống Kê Doanh Số
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              value={dateRange}
              onChange={(newValue) => setDateRange(newValue)}
              disableFuture
              sx={{ width: 300 }}
            />
          </LocalizationProvider>
          <Tooltip title="Làm mới dữ liệu">
            <IconButton onClick={handleRefresh} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Tổng doanh thu */}
        <Grid item xs={12} md={4}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.8 }}>Tổng Doanh Thu</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(totalRevenue)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Khoảng thời gian: {dateRange[0].format('DD/MM/YYYY')} - {dateRange[1].format('DD/MM/YYYY')}
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Doanh số theo danh mục */}
        <Grid item xs={12} md={8}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{ height: '100%' }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CategoryIcon sx={{ fontSize: 30, mr: 2, color: theme.palette.primary.main }} />
                <Typography variant="h6">Doanh Số Theo Danh Mục</Typography>
              </Box>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categorySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="category" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={formatNumber}
                      tick={{ fontSize: 12 }}
                    />
                    <RechartsTooltip 
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                        border: 'none',
                        borderRadius: theme.shape.borderRadius
                      }}
                    />
                    <Bar 
                      dataKey="sales" 
                      fill={theme.palette.primary.main}
                      radius={[4, 4, 0, 0]}
                    >
                      <LabelList 
                        dataKey="sales" 
                        position="top" 
                        formatter={formatNumber}
                        style={{ fontSize: 12 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Sản phẩm bán chạy */}
        <Grid item xs={12}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <InventoryIcon sx={{ fontSize: 30, mr: 2, color: theme.palette.primary.main }} />
                <Typography variant="h6">Sản Phẩm Bán Chạy</Typography>
              </Box>
              <Grid container spacing={2}>
                {topProducts.map((product, index) => (
                  <Grid item xs={12} sm={6} md={4} key={product.productId}>
                    <Paper 
                      sx={{ 
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[4]
                        }
                      }}
                    >
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%',
                        bgcolor: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Đã bán: {product.sold} sản phẩm
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SalesStatistics
