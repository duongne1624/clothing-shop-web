import { Box, Typography, IconButton, Dialog, Slide, Paper, Button, Input } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import CloseIcon from '@mui/icons-material/Close'
import { useState, useEffect, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '~/redux/cartSlice'
import { showSnackbar } from '~/redux/snackbarSlice'
import { tagColors } from '~/assets/js/tagColor'
import { API_ROOT } from '~/utils/constants'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

function ProductCard({ product }) {
  const [openDetail, setOpenDetail] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [image, setImage] = useState(null)

  const handleCloseBackdrop = () => setOpenDetail(false)
  const handleOpenBackdrop = (event) => {
    event.stopPropagation()
    setOpenDetail(true)
  }

  const imageFirst = product.colors[0].images[0]

  const navigate = useNavigate()

  const handleClickProduct = () => {
    navigate(`/product-details/${product.slug}`)
    window.scrollTo(0, 0)
  }

  const tag = 'SALE'

  useEffect(() => {
    if (product?.colors?.length > 0) {
      setSelectedColor(product.colors[0])
      setImage(product.colors[0].images[0])
    }
    if (product?.sizes?.length > 0) {
      setSelectedSize(product.sizes[0])
    }
  }, [product])

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
    setImage(color.images[0])
  }

  const handleChooseSize = (size) => {
    setSelectedSize(size)
  }

  const dispatch = useDispatch()

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity, selectedColor, selectedSize, slug: product.slug }))
    setOpenDetail(false)
    dispatch(showSnackbar({ message: 'Sản phẩm được thêm vào giỏ hàng!', severity: 'success' }))
  }

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return ''
    const url = String(imageUrl)
    if (url.startsWith('http')) return url
    return `${API_ROOT}${url}`
  }

  const isMobile = window.innerWidth <= 768

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: 1,
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transform: 'translateY(-5px)',
            '& .search-icon': {
              opacity: 1,
              transform: 'translate(-50%, -50%) scale(1)'
            },
            '& .cart-button': {
              transform: 'translateY(-5px)',
              backgroundColor: '#000000',
              color: '#fff'
            }
          }
        }}
        onClick={() => handleClickProduct()}
      >
        {/* Hộp chứa hình ảnh */}
        <Box
          sx={{
            width: '100%',
            height: 'fit-content',
            overflow: 'hidden',
            position: 'relative',
            borderRadius: '8px'
          }}
        >
          {tag && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: tagColors[tag] || tagColors.DEFAULT,
                color: '#fff',
                padding: '4px 12px',
                fontSize: '12px',
                borderRadius: '20px',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: 1
              }}
            >
              {tag}
            </Box>
          )}

          {/* Hình ảnh sản phẩm */}
          <img
            src={getImageUrl(imageFirst)}
            width="100%"
            height="100%"
            style={{
              width: '100%',
              height: 400,
              objectFit: 'cover',
              borderRadius: 8,
              transition: 'transform 0.3s ease-in-out'
            }}
            alt="product"
          />

          {/* Icon tìm kiếm */}
          {!isMobile && (
            <IconButton
              className="search-icon"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(0.8)',
                backgroundColor: 'rgba(255,255, 255,0.95)',
                color: '#000',
                opacity: 0,
                transition: 'all 0.3s ease-in-out',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                '&:hover': {
                  opacity: 1,
                  transform: 'translate(-50%, -50%) scale(1.1)',
                  backgroundColor: '#ffffff',
                  color: '#000'
                }
              }}
            >
              <SearchIcon />
            </IconButton>
          )}

          {/* Nút giỏ hàng */}
          <Box
            className="cart-button"
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#000000',
              color: '#fff',
              borderRadius: '50%',
              overflow: 'hidden',
              cursor: 'pointer',
              width: '40px',
              height: '40px',
              transition: 'all 0.3s ease-in-out',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 1,
              '&:hover': {
                backgroundColor: '#ffffff',
                color: '#000',
                transform: 'translateY(-5px) scale(1.1)'
              }
            }}
            onClick={handleOpenBackdrop}
          >
            <LocalMallOutlinedIcon
              sx={{
                fontSize: '20px',
                transition: 'all 0.3s ease-in-out'
              }}
            />
          </Box>
        </Box>

        {/* Thông tin sản phẩm */}
        <Box sx={{ p: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: '#333',
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {product.name}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: '#000',
              fontSize: '1.1rem'
            }}
          >
            {formatCurrency(product.price)}₫
          </Typography>
        </Box>

        {/*          Dialog thêm sản phẩm vào giỏ hàng           */}
        <Dialog
          open={openDetail}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseBackdrop}
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          maxWidth="md"
          sx={{
            '& .MuiDialog-paper': {
              height: 'fit-content',
              maxWidth: {
                xl: '40%',
                lg: '50%',
                md: '65%',
                xs: '90%'
              },
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              animation: 'slideUp 0.3s ease-out'
            }
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Nút đóng Dialog */}
          <IconButton
            onClick={handleCloseBackdrop}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: '#000',
              zIndex: 1500,
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              transition: '0.3s',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{
            display: 'flex',
            flexDirection: {
              sm: 'row',
              xs: 'column'
            },
            justifyContent: 'space-between',
            gap: 2,
            p: 2
          }}>
            {/* Hình ảnh */}
            <Paper sx={{
              width: {
                md: '40%',
                sm: '42%',
                xs: '100%'
              },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}>
              <img
                src={getImageUrl(image)}
                alt="product"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />
            </Paper>

            {/* Thông tin sản phẩm */}
            <Box sx={{
              width: {
                md: '60%',
                sm: '58%',
                xs: '100%'
              },
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <Paper sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}>
                {/* Tên sản phẩm */}
                <Typography variant="h5" sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
                  {product.name}
                </Typography>

                {/* Mã sản phẩm */}
                <Typography variant="body2" sx={{ color: 'gray' }}>
                  Mã sản phẩm: <strong>{product._id}</strong>
                </Typography>

                {/* Giá sản phẩm */}
                <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                  {formatCurrency(product.price)}₫
                </Typography>

                {/* Màu sắc */}
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
                          src={getImageUrl(color.images[0])}
                          alt="variant"
                          style={{ width: '100%', borderRadius: '50%' }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Kích thước */}
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


                {/* Số lượng & Thêm vào giỏ hàng */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  {/* Điều chỉnh số lượng */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #e1e1e1',
                    borderRadius: '5px'
                  }}>
                    <Button
                      sx={{ minWidth: '20px', padding: '5px 12px' }}
                      onClick={handleDecrease}
                    >–</Button>
                    <Input
                      value={quantity}
                      readOnly
                      sx={{
                        width: '30px',
                        textAlign: 'center',
                        fontSize: '16px',
                        border: 'none',
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
                      sx={{ minWidth: '20px', padding: '5px 12px' }}
                      onClick={handleIncrease}
                    >+</Button>
                  </Box>

                  {/* Nút Thêm vào giỏ hàng */}
                  <Button
                    variant="contained"
                    size="medium"
                    endIcon={<AddShoppingCartIcon />}
                    sx={{
                      p: '10px 20px',
                      backgroundColor: '#000000',
                      border: '1px solid #000000',
                      color: '#fff',
                      transition: '0.3s',
                      '&:hover': { backgroundColor: '#e6e6e6', color: '#000000', boxShadow: 'none' }
                    }}
                    onClick={handleAddToCart}
                  >
                    THÊM
                  </Button>
                </Box>

                {/* Link xem chi tiết */}
                <Typography
                  variant="body2"
                  sx={{ textDecoration: 'underline', color: 'gray', cursor: 'pointer', mt: 1 }}
                  onClick={handleClickProduct}
                >
                  Xem chi tiết »
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Dialog>
      </Box>
    </>
  )
}

export default ProductCard