import { Box, Input, Paper, Typography, Button } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import Coupon from '~/pages/Product/Coupon/Coupon'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import { fetchProductDetailsAPI, fetchProductsAPI } from '~/apis'
import ProductSlider from '~/components/ProductSlider/ProductSlider'

function ProductDetails() {
  const [product, setProduct] = useState(null)
  const [products, setProducts] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [image, setImage] = useState(null)

  const { slug } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!slug) {
      navigate('/not-found')
      return
    }

    fetchProductDetailsAPI(slug)
      .then((product) => {
        if (!product) {
          navigate('/not-found')
        } else {
          setProduct(product)
        }
      })
      .catch(() => {
        navigate('/not-found')
      })
  }, [slug, navigate])

  useEffect(() => {
    if (product?.colors?.length > 0) {
      setSelectedColor(product.colors[0])
      if (product.colors[0].images.length > 0) {
        setImage(product.colors[0].images[0])
      }
    }
    if (product?.sizes?.length > 0) {
      setSelectedSize(product.sizes[0])
    }
  }, [product])

  // Lấy danh sách sản phẩm
  useEffect(() => {
    fetchProductsAPI()
      .then((products) => {
        if (!products) {
          navigate('/not-found')
        } else {
          setProducts(products)
        }
      })
      .catch(() => {
        navigate('/not-found')
      })
  }, [navigate])

  const allImages = product?.colors.flatMap(color => color.images)

  function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handleDecrease = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1))
  }

  const handleIncrease = () => {
    setQuantity(prev => prev + 1)
  }

  const handleChooseColor = (color) => {
    setSelectedColor(color)
  }

  const handleChooseSize = (size) => {
    setSelectedSize(size)
  }

  return (
    <>
      {product && (
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
                <img src={image} width='100%' height='100%' />
                <ImageList sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'flex',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  m: 0,
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  }
                }}>
                  {allImages.map((item, index) => (
                    <ImageListItem key={index} onClick={() => setImage(item)} sx={{
                      cursor: 'pointer',
                      maxWidth: '20%',
                      minWidth: '20%',
                      border: `1px solid ${image === item ? '#000000' : 'none'}`
                    }}>
                      <img
                        srcSet={item}
                        src={item}
                        loading="lazy"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Paper>
              {/*        Thông tin sản phẩm          */}
              <Box sx={{
                width: {
                  md:'49%',
                  xs: '100%'
                },
                height: 'fit-content',
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}>
                {/*        Thông tin sản phẩm          */}
                <Paper sx={{
                  height: 'fit-content',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 1
                }}>
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
                  <Box>
                    <Typography variant="body2">Màu sắc: <strong>{selectedColor ? selectedColor.name : 'Chưa chọn'}</strong></Typography>
                    <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                      {product.colors.map((color, index) => (
                        <Box key={index}
                          onClick={() => handleChooseColor(color)}
                          sx={{
                            width: 35,
                            height: 35,
                            borderRadius: '50%',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            p: '3px',
                            border: `1px solid ${selectedColor === color ? '#e4393c' : '#e5e5e5'}`,
                            transition: '0.3s',
                            '&:hover': {
                              borderColor: '#e4393c'
                            }
                          }}>
                          <img
                            src={color.images[0]}
                            alt="variant"
                            style={{ width: '100%', borderRadius: '50%' }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  {/*             Kích thước              */}
                  <Box>
                    <Typography variant="body2">Kích thước: <strong>{selectedSize || 'Chưa chọn'}</strong></Typography>
                    <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                      {product.sizes.map((size, index) => (
                        <Box key={index}
                          onClick={() => handleChooseSize(size)}
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: `1px solid ${selectedSize === size ? '#e4393c' : '#e5e5e5'}`,
                            transition: '0.3s',
                            '&:hover': {
                              borderColor: '#e4393c'
                            }
                          }}>
                          <Typography variant="body2">{size}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  {/*             Số lượng & thêm & mua ngay              */}
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 3,
                    alignItems: 'center',
                    marginTop: 5
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
                          minWidth: '30px',
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
                          width: '30px',
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
                          minWidth: '30px',
                          padding: '5px 16px',
                          fontSize: '20px',
                          cursor: 'pointer'
                        }}
                        onClick={handleIncrease}
                      >
                        +
                      </Button>
                    </Box>
                    {/* Thêm vào giỏ hàng & mua hàng ngay */}
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 1
                    }}>
                      <Button
                        variant='contained' size='medium'
                        endIcon= {<AddShoppingCartIcon />}
                        sx={{
                          p: '10px 30px',
                          minWidth: '140px'
                        }}>
                        THÊM
                      </Button>
                      {/* Mua ngay */}
                      <Button
                        variant='contained' size='medium'
                        sx={{
                          p: '10px 30px',
                          minWidth: '140px'
                        }}>
                        MUA NGAY
                      </Button>
                    </Box>
                  </Box>
                </Paper>
                {/*        Ưu đãi & chăm sóc khách hàng          */}
                <Paper sx={{
                  display: 'grid',
                  gridTemplateColumns: '33% 33% 33%',
                  gap: '10px',
                  height: 'fit-content',
                  p: 2
                }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <img src='https://file.hstatic.net/1000253775/file/z4635451118875_c98fff6e965c4957a2beef70df6df0f8_afcea78391a640c9bcef22ce88aca7d6.jpg' width='45' height='45' />
                    <Typography variant='body2' align='center'>Đổi trả tận nhà trong vòng 15 ngày</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <img src='https://file.hstatic.net/1000253775/file/z4635451151763_13f64ed25050f361cfb0a70fda62b2c2_efbb28df6328412b9200cd92a795396e.jpg' width='45' height='45' />
                    <Typography variant='body2' align='center'>Miễn phí vận chuyển đơn từ 399k</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <img src='https://file.hstatic.net/1000253775/file/z4635451129757_228e4824d8a593038b9f20d5e53d4d08_7e46b4c108bc481e8c2351f909bdcba4.jpg' width='45' height='45' />
                    <Typography variant='body2' align='center'>Bảo hành trong vòng 30 ngày</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <img src='https://file.hstatic.net/1000253775/file/z4635451140541_2b09e178f1b8b4763b266875fd2c8db6_8b536c9ae5e24c17961fdb906d3f5022.jpg' width='45' height='45' />
                    <Typography variant='body2' align='center'>Hotline 0287.100.6789 hỗ trợ từ 8h30-24h</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <img src='https://file.hstatic.net/1000253775/file/z4635451129712_78e0e70db6fffe43fbb9a3e680cb3ed0_a2b8379adf4843a4898c621b37c2b42a.jpg' width='45' height='45' />
                    <Typography variant='body2' align='center'>Giao hàng toàn quốc</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <img src='https://file.hstatic.net/1000253775/file/z4635451151761_2fe8731e9d20060a54130996be16cd2e_e8e090599dd9467abdd66feb9ba3474f.jpg' width='45' height='45' />
                    <Typography variant='body2' align='center'>Có cộng dồn ưu đãi KHTT</Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>
            {/*     Sản phẩm vừa xem         */}
            <Paper sx={{
              display: 'flex',
              flexDirection: 'column',
              mt: 2,
              p: 2,
              alignItems: 'center',
              maxWidth: '100%'
            }}>
              <Typography variant='h6'>SẢN PHẨM VỪA XEM</Typography>
              <Typography
                sx={{
                  textAlign: 'center',
                  color: '#878787',
                  fontStyle: 'italic',
                  margin: 0,
                  display: 'inline-block',
                  paddingTop: '15px',
                  position: 'relative',
                  minWidth: '150px',
                  '&::before': {
                    content: '"///"',
                    color: '#000',
                    position: 'absolute',
                    top: '-5px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '20px',
                    textAlign: 'center',
                    background: '#fff',
                    zIndex: 9,
                    fontSize: '14px'
                  },
                  '&::after': {
                    content: '""',
                    width: '120px',
                    height: '1px',
                    background: '#000',
                    position: 'absolute',
                    top: '5px',
                    left: '15px'
                  }
                }}
              >
              </Typography>
              {/*    Danh sách sản phẩm vừa xem     */}
              <ProductSlider products={products} />
            </Paper>
          </Box>
        </>
      )}
    </>
  )
}

export default ProductDetails
