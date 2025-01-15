import Box from '@mui/material/Box'
import Header from '../../components/Header'
import Categories from '../../components/Categories'

function Home() {
  return (
    <Box>
      {/* Header */}
      <Header />

      {/* Nội dung */}
      <Box sx={{ p: 2 }}>
        {/* Danh mục */}
        <Categories />
      </Box>
    </Box>
  )
}

export default Home
