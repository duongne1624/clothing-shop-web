import { Box, Paper, Typography, Breadcrumbs, Link, Grid, Chip } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsAPI } from '~/apis'
import Banner from './Banner/Banner'
import Policies from './Policies/Policies'
import VoucherList from './VoucherList/VoucherList'
import ProductSlider from '~/components/ProductSlider/ProductSlider'
import FashionNews from './FashionNews'
import CustomerReviews from './CustomerReviews'
import useTitle from '~/hook/useTitle'
import HomeIcon from '@mui/icons-material/Home'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import NewReleasesIcon from '@mui/icons-material/NewReleases'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import StarIcon from '@mui/icons-material/Star'

function Home() {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.products) || []
  const [bestSellers, setBestSellers] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [discountedProducts, setDiscountedProducts] = useState([])
  const [topRatedProducts, setTopRatedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useTitle('Trang chủ | Clothing Shop')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const productsData = await fetchProductsAPI()
        if (productsData) {
          // Lọc sản phẩm bán chạy
          setBestSellers(productsData.filter(product => product.sold >= 10))
          // Lọc sản phẩm mới nhất
          setNewArrivals(productsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10))
          // Lọc sản phẩm giảm giá
          setDiscountedProducts(productsData.filter(product => product.discount > 0).slice(0, 10))
          // Lọc sản phẩm đánh giá cao
          setTopRatedProducts(productsData.filter(product => product.rating >= 4.5).slice(0, 10))
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  const ProductSection = ({ title, icon, products, color }) => (
    <Paper
      elevation={0}
      sx={{
        mt: 4,
        p: 3,
        bgcolor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
        {icon}
        <Typography variant="h5" sx={{ fontWeight: 600, color: color }}>
          {title}
        </Typography>
      </Box>
      <ProductSlider products={products} />
    </Paper>
  )

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', px: 2 }}>
      <Paper
        elevation={0}
        sx={{
          p: 1,
          mb: 1,
          backgroundColor: '#f5f5f5',
          borderRadius: '8px'
        }}
      >
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            '& .MuiBreadcrumbs-separator': {
              mx: 1
            }
          }}
        >
          <Link
            underline="hover"
            color="inherit"
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#666',
              '&:hover': {
                color: '#000'
              }
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Trang chủ
          </Link>
        </Breadcrumbs>
      </Paper>

      <Banner />
      <Policies />
      <VoucherList />

      <ProductSection
        title="Sản phẩm bán chạy"
        icon={<TrendingUpIcon sx={{ color: '#e91e63', fontSize: 28 }} />}
        products={bestSellers}
        color="#e91e63"
      />

      <ProductSection
        title="Sản phẩm mới nhất"
        icon={<NewReleasesIcon sx={{ color: '#2196f3', fontSize: 28 }} />}
        products={newArrivals}
        color="#2196f3"
      />

      <ProductSection
        title="Sản phẩm giảm giá"
        icon={<LocalOfferIcon sx={{ color: '#f44336', fontSize: 28 }} />}
        products={discountedProducts}
        color="#f44336"
      />

      <ProductSection
        title="Sản phẩm đánh giá cao"
        icon={<StarIcon sx={{ color: '#ff9800', fontSize: 28 }} />}
        products={topRatedProducts}
        color="#ff9800"
      />

      <FashionNews />

      <CustomerReviews />
    </Box>
  )
}

export default Home
