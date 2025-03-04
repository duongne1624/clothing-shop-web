import { Grid, Box } from '@mui/material'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import { useEffect, useState } from 'react'
import { getAllProductByCategorySlug } from '~/apis'
import { useParams } from 'react-router-dom'
import useTitle from '~/hook/useTitle'
import ProductCard from '~/components/ProductCard/ProductCard'
import SortDropdown from '~/components/SortDropdown/SortDropdown'
import { sortProducts } from '~/utils/sorts'

const Categories = () => {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('')
  const [sortOption, setSortOption] = useState('featured')

  useTitle(`Danh sách sản phẩm | ${category}`)

  const { slug } = useParams()

  useEffect(() => {
    getAllProductByCategorySlug(slug)
      .then((res) => {
        setProducts(res.products)
        setCategory(res.category)
      })
      .catch(() => {})
  }, [slug])

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
      <Breadcrumbs name={category} />

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

export default Categories
