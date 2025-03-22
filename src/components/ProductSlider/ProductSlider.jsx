import { useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ProductCard from '~/components/ProductCard/ProductCard'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

const ProductSlider = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const itemsPerPage = isMobile ? 1 : isTablet ? 2 : 3

  const handleNext = () => {
    if (currentIndex + itemsPerPage < products.length) {
      setCurrentIndex(currentIndex + itemsPerPage)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - itemsPerPage)
    }
  }

  const handleDotClick = (index) => {
    setCurrentIndex(index * itemsPerPage)
  }

  const totalDots = Math.ceil(products.length / itemsPerPage)

  return (
    <Box sx={{
      position: 'relative',
      maxWidth: '100%',
      overflow: 'hidden',
      mt: 2
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
            backgroundColor: 'rgba(255,255,255,0.9)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': { 
              backgroundColor: 'rgba(255,255,255,1)',
              transform: 'translateY(-50%) scale(1.1)'
            }
          }}
          onClick={handlePrev}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
      )}

      {/* Danh sách sản phẩm */}
      <Box sx={{
        display: 'flex',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
        gap: '2%'
      }}>
        {products?.map((product) => (
          <Box key={product._id} sx={{
            flex: `0 0 ${(100 / itemsPerPage) - 1.7}%`,
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)'
            }
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
            backgroundColor: 'rgba(255,255,255,0.9)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': { 
              backgroundColor: 'rgba(255,255,255,1)',
              transform: 'translateY(-50%) scale(1.1)'
            }
          }}
          onClick={handleNext}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      )}

      {/* Dots indicator */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 1,
        mt: 2
      }}>
        {Array.from({ length: totalDots }, (_, index) => (
          <Box
            key={index}
            onClick={() => handleDotClick(index)}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: currentIndex === index * itemsPerPage ? '#000' : '#e0e0e0',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: currentIndex === index * itemsPerPage ? '#000' : '#bdbdbd',
                transform: 'scale(1.2)'
              }
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

export default ProductSlider
