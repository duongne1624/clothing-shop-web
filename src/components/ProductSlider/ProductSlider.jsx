import { useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ProductCard from '~/components/ProductCard/ProductCard'

const ProductSlider = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const itemsPerPage = 3

  const handleNext = () => {
    if (currentIndex + itemsPerPage < products.length) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <Box sx={{
      position: 'relative',
      maxWidth: '100%',
      overflow: 'hidden',
      mt: 5
    }}>
      {/* Nút mũi tên trái */}
      {currentIndex > 0 && (
        <IconButton
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            backgroundColor: 'rgba(255,255,255,0.8)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
          }}
          onClick={handlePrev}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
      )}

      {/* Danh sách sản phẩm */}
      <Box sx={{
        display: 'flex',
        transition: 'transform 0.3s ease-in-out',
        transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
        gap: '2%'
      }}>
        {products?.map((product) => (
          <Box key={product._id} sx={{
            flex: `0 0 ${(100 / itemsPerPage) - 1.7}%}`
          }}>
            <ProductCard product={product} />
          </Box>
        ))}
      </Box>

      {/* Nút mũi tên phải */}
      {currentIndex + itemsPerPage < products.length && (
        <IconButton
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            backgroundColor: 'rgba(255,255,255,0.8)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
          }}
          onClick={handleNext}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      )}
    </Box>
  )
}

export default ProductSlider
