import { Box, Paper, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { fetchProductsAPI } from '~/apis'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import ProductSlider from '~/components/ProductSlider/ProductSlider'
import useTitle from '~/hook/useTitle'
import CartInfo from './CartInfo/CartInfo'

function MyCart() {
  const [products, setProducts] = useState([])

  const navigate = useNavigate()

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

  useTitle('Giỏ hàng của bạn')

  return (
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
        <Breadcrumbs name={'Giỏ hàng'} />

        {/*     Thông tin giỏ hàng        */}
        <CartInfo />
        {/*     Sản phẩm vừa xem         */}
        <Paper sx={{
          display: 'flex',
          flexDirection: 'column',
          mt: 2,
          p: 2,
          alignItems: 'center',
          maxWidth: '100%'
        }}>
          <Typography variant='h6'>BẠN CẦN CÓ</Typography>
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
          {/*    Bạn sẽ cần     */}
          <ProductSlider products={products} />
        </Paper>
      </Box>
    </>
  )
}

export default MyCart