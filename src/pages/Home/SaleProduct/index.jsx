import { Box, Typography, styled, keyframes, Pagination } from '@mui/material'
import Product from '~/components/Product'
import { useState } from 'react'
import MultipleTag from '~/components/MultipleTag'

// Tạo hiệu ứng chữ nhấp nháy đổi màu
const blinkAnimation = keyframes`
  0%, 100% {
    color: red;
  }
  50% {
    color: yellow;
  }
`

// Tiêu đề chính với hiệu ứng nhấp nháy
const FlashingText = styled(Typography)(() => ({
  animation: `${blinkAnimation} 1.5s infinite`,
  fontWeight: 700,
  fontSize: '2rem',
  textAlign: 'center',
  textTransform: 'uppercase'
}))

function SaleProducts() {
  const products = Array(2000).fill({ name: 'Áo hoodie xanh', price: '300.000 VNĐ' }) // Giả sử có 2000 sản phẩm
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 8

  // Tính toán sản phẩm hiển thị dựa trên trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)

  // Tính tổng số trang
  const totalPages = Math.ceil(products.length / productsPerPage)

  // Xử lý thay đổi trang
  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderTop: '2px solid',
        p: 1,
        overflow: 'hidden' // Đảm bảo chữ lớn không tràn ra ngoài
      }}
    >
      <FlashingText variant="h4" gutterBottom>
        TẾT SALE SẬP SÀN
      </FlashingText>
      <Box sx={{ p: 2 }}>
        <MultipleTag />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
          width: {
            xs: '100%',
            sm: '90%',
            md: '80%',
            lg: '70%'
          }
        }}
      >
        {currentProducts.map((product, index) => (
          <Product key={index} name={product.name} price={product.price} />
        ))}
      </Box>

      {/* Pagination Component */}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 2 }}
      />
    </Box>
  )
}

export default SaleProducts