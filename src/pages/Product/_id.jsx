import { Box, Paper, Typography } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import { fetchProductDetailsAPI, fetchProductsAPI, couponApi } from '~/apis'
import ProductSlider from '~/components/ProductSlider/ProductSlider'
import ProductInfo from './ProductInfo/ProductInfo'
import useTitle from '~/hook/useTitle'

function ProductDetails() {
  const [product, setProduct] = useState(null)
  const [products, setProducts] = useState([])
  const [coupons, setCoupons] = useState([])

  const { slug } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!slug) {
      navigate('/')
      return
    }

    fetchProductDetailsAPI(slug)
      .then((product) => {
        if (!product) {
          navigate('/')
        } else {
          setProduct(product)
        }
      })
      .catch(() => {
        navigate('/')
      })
  }, [slug, navigate])

  // Lấy danh sách sản phẩm
  useEffect(() => {
    fetchProductsAPI()
      .then((products) => {
        if (!products) {
          navigate('/')
        } else {
          setProducts(products)
        }
      })
      .catch(() => {
        navigate('/')
      })
  }, [navigate])

  // Lấy danh sách giảm giá
  useEffect(() => {
    couponApi.getCoupons()
      .then((coupons) => {
        if (!coupons) {
          navigate('/')
        } else {
          setCoupons(coupons)
        }
      })
      .catch(() => {
        navigate('/')
      })
  }, [navigate])

  useTitle(`Thông tin sản phẩm | ${product?.name}`)

  return (
    <>
      {product && (
        <>
          {/*    Content     */}
          <Box sx={{
            maxWidth: {
              xl: '80%',
              sm: '90%',
              xs: '100%'
            },
            height: 'fit-content',
            ml: {
              xl: '10%',
              sm: '5%',
              xs: '0'
            },
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Breadcrumbs category={product.category.name} categorySlug={product.category.slug} name={product.name} />
            {/*     Thông tin sản phẩm         */}
            <ProductInfo product={product} coupons={coupons} />
            {/*     Sản phẩm vừa xem         */}
            <Paper sx={{
              display: 'flex',
              flexDirection: 'column',
              mt: 2,
              p: 2,
              alignItems: 'center',
              width: '100%'
            }}>
              <Typography variant='h6'>CÓ THỂ BẠN THÍCH</Typography>
              <Typography
                sx={{
                  textAlign: 'center',
                  color: '#878787',
                  fontStyle: 'italic',
                  margin: 0,
                  display: 'inline-block',
                  paddingTop: '15px',
                  position: 'relative',
                  minWidth: '150px',
                  '&::before': {
                    content: '"///"',
                    color: '#000',
                    position: 'absolute',
                    top: '-5px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '20px',
                    textAlign: 'center',
                    background: '#fff',
                    zIndex: 9,
                    fontSize: '14px'
                  },
                  '&::after': {
                    content: '""',
                    width: '120px',
                    height: '1px',
                    background: '#000',
                    position: 'absolute',
                    top: '5px',
                    left: '15px'
                  }
                }}
              >
              </Typography>
              {/*    Danh sách sản phẩm vừa xem     */}
              <ProductSlider products={products} />
            </Paper>
          </Box>
        </>
      )}
    </>
  )
}

export default ProductDetails
