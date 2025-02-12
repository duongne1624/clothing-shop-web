import { Box, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import { fetchProductDetailsAPI } from '~/apis'

function ProductDetails() {
  const [product, setProduct] = useState(null)

  useEffect(() => {
    //Tạm thời
    const productId = '67ac8b76a43def2851127ed5'

    //Call API
    fetchProductDetailsAPI(productId).then(product => {
      setProduct(product)
    })
  }, [])

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
          <Typography variant='h4'>Thông tin sản phẩm</Typography>
          <Typography variant='h4'>{product.name}</Typography>
          <Typography variant='h4'>{product.description}</Typography>
          <Typography variant='h4'>{product.price}</Typography>
        </Box>
      </Paper>
    </>
  )
}

export default ProductDetails
