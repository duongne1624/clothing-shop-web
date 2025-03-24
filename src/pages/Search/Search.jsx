import { Grid, Box } from '@mui/material'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import { useEffect, useState } from 'react'
import { searchProduct } from '~/apis'
import { useSearchParams } from 'react-router-dom'
import useTitle from '~/hook/useTitle'
import ProductCard from '~/components/ProductCard/ProductCard'
import SortDropdown from '~/components/SortDropdown/SortDropdown'
import { sortProducts } from '~/utils/sorts'

function Search() {
  const [products, setProducts] = useState([])
  const [sortOption, setSortOption] = useState('featured')

  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('search')
  useTitle(`Danh sách sản phẩm | ${keyword}`)

  useEffect(() => {
    searchProduct(keyword)
      .then((products) => {
        setProducts(products)
      })
  }, [keyword])

  const sortedProducts = sortProducts(products, sortOption)

  return (
    <Box sx={{
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
      <Breadcrumbs name={'Tìm kiếm'} />

      {/* Bộ lọc sắp xếp */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 2 }}>
        <SortDropdown onSortChange={setSortOption} />
      </Box>

      <Grid container spacing={2} sx={{ padding: 2 }}>
        {sortedProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Search