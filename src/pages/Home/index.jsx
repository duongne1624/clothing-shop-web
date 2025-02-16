import { Box, Paper, Typography } from '@mui/material'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import Banner from './Banner/Banner'
import Policies from './Policies/Policies'
import VoucherList from './VoucherList/VoucherList'
import Blog from './Blog/Blog'
import ProductSlider from '~/components/ProductSlider/ProductSlider'
import { fetchProductsAPI } from '~/apis'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchProductsAPI()
      .then((products) => {
        if (!products) {
          //navigate('/not-found')
        } else {
          setProducts(products)
        }
      })
      .catch(() => {
        //navigate('/not-found')
      })
  }, [navigate])

  return (
    <>
      <Paper sx={{
        width: {
          xl: '70%',
          sm: '80%',
          xs: '100%'
        },
        height: 'fit-content',
        ml: {
          xl: '15%',
          sm: '10%',
          xs: '0'
        },
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Breadcrumbs />
        {/***************************Banner**************************/}
        <Banner />
        <Box sx={{
          pt: 5,
          px: {
            xl: 15,
            lg: 10,
            md: 5,
            sm: 2,
            xs: 0
          },
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          <Policies />
          {/***************************Ưu đãi**************************/}
          <VoucherList />
          {/*     Sản phẩm vừa xem         */}
          <Paper sx={{
            display: 'flex',
            flexDirection: 'column',
            mt: 2,
            p: 2,
            alignItems: 'center',
            maxWidth: '100%'
          }}>
            <Typography variant='h6'>SẢN PHẨM VỪA XEM</Typography>
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
          <Blog />
        </Box>
      </Paper>
    </>
  )
}

export default Home
