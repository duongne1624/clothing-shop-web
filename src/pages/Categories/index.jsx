import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Grid, Typography, Box, CircularProgress, Pagination, Paper, Drawer, useMediaQuery, useTheme, Slider, FormGroup, FormControlLabel, Checkbox, Divider } from '@mui/material'
import ProductCard from '~/components/ProductCard/ProductCard'
import axios from 'axios'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import useTitle from '~/hook/useTitle'
import SortDropdown from '~/components/SortDropdown/SortDropdown'
import { sortProducts } from '~/utils/sorts'
import FilterListIcon from '@mui/icons-material/FilterList'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { motion, AnimatePresence } from 'framer-motion'
import { API_ROOT } from '~/utils/constants'

// Mediator
class ProductMediator {
  constructor() {
    this.products = []
    this.sortOption = 'featured'
    this.subscribers = []
  }

  setProducts(products) {
    this.products = products
    this.notify()
  }

  setSortOption(option) {
    this.sortOption = option
    this.notify()
  }

  subscribe(callback) {
    this.subscribers.push(callback)
  }

  notify() {
    const sortedProducts = sortProducts(this.products, this.sortOption)
    this.subscribers.forEach((callback) => callback(sortedProducts))
  }
}

const mediator = new ProductMediator()

const CategoryPage = () => {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: [0, 2000000],
    sizes: [],
    colors: []
  })
  const productsPerPage = 12
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useTitle(`Danh sách sản phẩm | ${category}`)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        let response

        // Xử lý các trường hợp đặc biệt
        switch (slug) {
        case 'new-arrivals':
        { response = await axios.get(`${API_ROOT}/v1/products`)
          // Lọc sản phẩm mới (ví dụ: sản phẩm được tạo trong 30 ngày gần đây)
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          response.data = response.data.filter(product =>
            new Date(product.createdAt) > thirtyDaysAgo
          )
          break
        }

        case 'all-products':
          response = await axios.get(`${API_ROOT}/v1/products`)
          break

        case 'mens-shirts':
          response = await axios.get(`${API_ROOT}/v1/products/GetProductsByCategoryType/65d123456789abcd12340001`)
          break

        case 'mens-pants':
          response = await axios.get(`${API_ROOT}/v1/products/GetProductsByCategoryType/65d123456789abcd12340005`)
          break

        case 'sale':
          response = await axios.get(`${API_ROOT}/v1/products`)
          response.data = response.data.filter(product =>
            product.offerIds && product.offerIds.length > 0
          )
          break

        default:
          response = await axios.get(`${API_ROOT}/v1/products/GetProductsByCategorySlug/${slug}`)
        }

        const productsData = response.data.products || response.data
        setProducts(productsData)
        setTotalPages(Math.ceil(productsData.length / productsPerPage))
        // Lấy thông tin danh mục nếu có
        if (response.data.category) {
          setCategory(response.data.category)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [slug])

  useEffect(() => {
    mediator.subscribe(setProducts)
  }, [])

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const getPageTitle = () => {
    switch (slug) {
    case 'new-arrivals':
      return 'Hàng Mới'
    case 'all-products':
      return 'Tất Cả Sản Phẩm'
    case 'mens-shirts':
      return 'Áo Nam'
    case 'mens-pants':
      return 'Quần Nam'
    case 'sale':
      return 'Khuyến Mãi'
    default:
      return category || 'Danh Mục Sản Phẩm'
    }
  }

  const getPageDescription = () => {
    switch (slug) {
    case 'new-arrivals':
      return 'Khám phá bộ sưu tập mới nhất của chúng tôi'
    case 'all-products':
      return 'Tất cả sản phẩm chất lượng cao'
    case 'mens-shirts':
      return 'Bộ sưu tập áo nam thời trang'
    case 'mens-pants':
      return 'Bộ sưu tập quần nam đa dạng'
    case 'sale':
      return 'Ưu đãi đặc biệt cho bạn'
    default:
      return 'Khám phá bộ sưu tập của chúng tôi'
    }
  }

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const filteredProducts = products.filter(product => {
    if (product.price < selectedFilters.priceRange[0] || product.price > selectedFilters.priceRange[1]) {
      return false
    }

    if (selectedFilters.sizes.length > 0 && !selectedFilters.sizes.some(size => product.sizes.includes(size))) {
      return false
    }

    if (selectedFilters.colors.length > 0 && !selectedFilters.colors.some(color =>
      product.colors.some(c => c.name.toLowerCase() === color.toLowerCase())
    )) {
      return false
    }

    return true
  })

  const sortedAndFilteredProducts = sortProducts(filteredProducts, mediator.sortOption)

  const startIndex = (page - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = sortedAndFilteredProducts.slice(startIndex, endIndex)

  const priceMarks = [
    { value: 0, label: '0đ' },
    { value: 500000, label: '500K' },
    { value: 1000000, label: '1M' },
    { value: 1500000, label: '1.5M' },
    { value: 2000000, label: '2M' }
  ]

  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL']
  const colorOptions = ['Đen', 'Trắng', 'Đỏ', 'Xanh', 'Vàng', 'Tím', 'Hồng', 'Xám']

  const FilterSection = () => (
    <Box sx={{ p: 2 }}>
      {/* Price Range Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Khoảng giá
        </Typography>
        <Slider
          value={selectedFilters.priceRange}
          onChange={(event, newValue) => handleFilterChange('priceRange', newValue)}
          valueLabelDisplay="auto"
          min={0}
          max={2000000}
          marks={priceMarks}
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2">
            {selectedFilters.priceRange[0].toLocaleString()}đ
          </Typography>
          <Typography variant="body2">
            {selectedFilters.priceRange[1].toLocaleString()}đ
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Size Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Kích thước
        </Typography>
        <FormGroup>
          {sizeOptions.map((size) => (
            <FormControlLabel
              key={size}
              control={
                <Checkbox
                  checked={selectedFilters.sizes.includes(size)}
                  onChange={(e) => {
                    const newSizes = e.target.checked
                      ? [...selectedFilters.sizes, size]
                      : selectedFilters.sizes.filter(s => s !== size)
                    handleFilterChange('sizes', newSizes)
                  }}
                />
              }
              label={size}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Color Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Màu sắc
        </Typography>
        <FormGroup>
          {colorOptions.map((color) => (
            <FormControlLabel
              key={color}
              control={
                <Checkbox
                  checked={selectedFilters.colors.includes(color)}
                  onChange={(e) => {
                    const newColors = e.target.checked
                      ? [...selectedFilters.colors, color]
                      : selectedFilters.colors.filter(c => c !== color)
                    handleFilterChange('colors', newColors)
                  }}
                />
              }
              label={color}
            />
          ))}
        </FormGroup>
      </Box>
    </Box>
  )

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ pb: 4 }}>
      <Breadcrumbs name={category} />

      {/* Hero Section */}
      <Box sx={{
        mb: 4,
        py: 4,
        background: 'linear-gradient(45deg, #f5f5f5 30%, #ffffff 90%)',
        borderRadius: 2,
        px: 4
      }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 600 }}>
          {getPageTitle()}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {getPageDescription()}
        </Typography>
      </Box>

      {/* Filters and Sort Section */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton onClick={() => setShowFilters(true)}>
              <FilterListIcon />
            </IconButton>
          )}
          <Typography variant="body2" color="text.secondary">
            {sortedAndFilteredProducts.length} sản phẩm
          </Typography>
        </Box>
        <SortDropdown onSortChange={(option) => {
          mediator.setSortOption(option)
          const newSortedProducts = sortProducts(filteredProducts, option)
          mediator.setProducts(newSortedProducts)
        }} />
      </Paper>

      {/* Desktop Filters */}
      {!isMobile && (
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Paper sx={{ p: 2 }}>
              <FilterSection />
            </Paper>
          </Grid>
          <Grid item xs={9}>
            {/* Products Grid */}
            <Grid container spacing={3}>
              <AnimatePresence>
                {currentProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* Mobile View */}
      {isMobile && (
        <>
          {/* Products Grid */}
          <Grid container spacing={3}>
            <AnimatePresence>
              {currentProducts.map((product) => (
                <Grid item xs={12} sm={6} key={product._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>

          {/* Mobile Filters Drawer */}
          <Drawer
            anchor="left"
            open={showFilters}
            onClose={() => setShowFilters(false)}
            PaperProps={{
              sx: { width: { xs: '100%', sm: 300 } }
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Bộ lọc</Typography>
                <IconButton onClick={() => setShowFilters(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <FilterSection />
            </Box>
          </Drawer>
        </>
      )}

      {/* Pagination */}
      {sortedAndFilteredProducts.length > productsPerPage && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 4
        }}>
          <Pagination
            count={Math.ceil(sortedAndFilteredProducts.length / productsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  )
}

export default CategoryPage
