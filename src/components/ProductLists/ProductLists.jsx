import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import ProductCard from '../ProductCard/ProductCard'
import { fetchProductsAPI } from '~/apis'

function ProductLists() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const getProducts = async () => {
      const productsData = await fetchProductsAPI() // Gọi API đúng cách
      setProducts(productsData)
    }
    getProducts()
  }, [])

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
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </Box>
    </Box>
  )
}

export default ProductLists
