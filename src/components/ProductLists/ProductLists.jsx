import { Box, Typography } from '@mui/material'
import Product from './Product/Product'
import { useEffect, useState } from 'react'

function ProductLists() {
  const [products, setProducts] = useState(null)

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1.5
    }}>
      <Typography variant="h4">Sản phẩm mới</Typography>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        overflowX: 'auto',
        overflowY: 'hidden'
      }}>
        <Product />
        <Product />
        <Product />
        <Product />
        <Product />
        <Product />
        <Product />
      </Box>
    </Box>
  )
}

export default ProductLists
