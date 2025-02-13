import { Box, Input, Paper, Typography, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import Coupon from '~/pages/Product/Coupon/Coupon'
import { fetchProductDetailsAPI } from '~/apis'

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast'
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger'
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera'
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee'
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats'
  }
]

function ProductDetails() {
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    //Tạm thời
    // const productId = '67ac8b76a43def2851127ed5'
    const productSlug = 'quan-jeans-slimfit'

    //Call API
    fetchProductDetailsAPI(productSlug).then(product => {
      setProduct(product)
    })
  }, [])

  function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handleDecrease = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1))
  }

  const handleIncrease = () => {
    setQuantity(prev => prev + 1)
  }

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
        <Breadcrumbs />
        <Box sx={{
          display: 'flex',
          flexDirection: {
            md: 'row',
            xs: 'column'
          },
          justifyContent: 'space-between',
          gap: 2
        }}>
          {/*        Image          */}
          <Paper sx={{
            width: {
              md:'49%',
              xs: '100%'
            },
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: 'fit-content',
            gap: 2
          }}>
            <img src='https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=164&h=164&fit=crop&auto=format&dpr=2 2x' width='100%' height='100%' />
            <ImageList sx={{
              width: '100%',
              height: 'auto',
              display: 'flex',
              overflowX: 'auto',
              overflowY: 'hidden',
              m: 0
            }}>
              {itemData.map((item) => (
                <ImageListItem key={item.img}>
                  <img
                    srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                    alt={item.title}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Paper>
          <Paper sx={{
            width: {
              md:'49%',
              xs: '100%'
            },
            height: 'fit-content',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1
          }}>
            {product != null && (
              <>
                {/*        Tên sản phẩm          */}
                <Typography variant='h4'>{product.name}</Typography>

                {/*        Loại & mã sản phẩm          */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 0.75
                }}>
                  {/*        Mã sản phẩm          */}
                  <Typography variant='body2'>MSP: <strong>{product._id}</strong></Typography>
                  |
                  {/*        Loại          */}
                  <Typography variant='body2'>Loại: <strong>{product.categoryId}</strong></Typography>
                </Box>
                {/*        Giá cả          */}
                <Typography variant='h6'>{formatCurrency(product.price)}₫</Typography>
                {/*        Khuyến mãi - ưu đãi         */}
                <Coupon />
                {/*             Màu sắc               */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.2
                }}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 0.3,
                    alignItems: 'center'
                  }}>
                    <Typography variant='body2'>Màu sắc: <strong>{product.categoryId}</strong></Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                    {[...Array(2)].map((_, index) => (
                      <Box key={index} sx={{
                        width: 35,
                        height: 35,
                        borderRadius: '50px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        p: '3px',
                        border: '1px solid #e4393c' //Khi được chọn #e5e5e5
                      }}>
                        <img src="/Images/Users/avartar-default.jpg" alt='variant' style={{ width: '100%', borderRadius: '50%' }} />
                      </Box>
                    ))}
                  </Box>
                </Box>
                {/*             Kích thước              */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.2
                }}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center'
                  }}>
                    <Typography variant='body2'>Kích thước: <strong>S</strong></Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <img src='https://file.hstatic.net/200000525917/file/ruler-svg_74f5e49dbd8c4235a98dd991dcdfa38e.svg' width='15px' height='15px' />
                      <Typography variant='body2' sx={{ textDecoration: 'underline' }}>Hướng dẫn chọn size</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                    {[...Array(4)].map((_, index) => (
                      <Box key={index} sx={{
                        width: 35,
                        height: 35,
                        borderRadius: '5px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        alignItems: 'center',
                        position: 'relative',
                        justifyContent: 'center',
                        display: 'flex',
                        border: '1px solid #e4393c' //Khi được chọn #e5e5e5
                      }}>
                        <Typography variant='body2'>S</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
                {/*             Số lượng & thêm & mua ngay              */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                  alignItems: 'center'
                }}>
                  {/* Số lượng sản phẩm */}
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    alignItems: 'center',
                    border: '1px solid #e1e1e1',
                    borderRadius: '5px'
                  }}>
                    <Button
                      sx={{
                        minWidth: '40px',
                        padding: '5px 16px',
                        fontSize: '20px',
                        cursor: 'pointer'
                      }}
                      onClick={handleDecrease}
                    >
                      –
                    </Button>
                    <Input
                      value={quantity}
                      readOnly
                      sx={{
                        width: '50px',
                        textAlign: 'center',
                        fontSize: '18px',
                        '& input': { textAlign: 'center' },
                        '&:before': {
                          borderBottom: 'none !important'
                        },
                        '&:hover:before': {
                          borderBottom: 'none !important'
                        },
                        '&:after': {
                          borderBottom: 'none !important'
                        }
                      }}
                    />
                    <Button
                      sx={{
                        minWidth: '40px',
                        padding: '5px 16px',
                        fontSize: '20px',
                        cursor: 'pointer'
                      }}
                      onClick={handleIncrease}
                    >
                      +
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        </Box>
      </Box>
    </>
  )
}

export default ProductDetails
