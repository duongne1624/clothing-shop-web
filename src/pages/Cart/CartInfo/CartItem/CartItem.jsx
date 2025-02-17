import { Box, Input, Typography, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { editquantity, removeFromCart } from '~/redux/cartSlice'
import ClearIcon from '@mui/icons-material/Clear'

function CartItem({ product }) {
  const [quantity, setQuantity] = useState(product.quantity)
  const [price, setPrice] = useState(product.price * product.quantity)
  const [isRemoving, setIsRemoving] = useState(false)

  const navigate = useNavigate()

  function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handleDecrease = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1))
    setPrice(prev => (prev > product.price ? prev - product.price : product.price))
  }

  const handleIncrease = () => {
    setQuantity(prev => prev + 1)
    setPrice(prev => prev + product.price)
  }

  const dispatch = useDispatch()

  useEffect(() => {
    const productId = product.id
    const color = product.color
    const size = product.size
    dispatch(editquantity({ productId, newquantity: quantity, color, size }))
  }, [quantity, product.size, product.color, product.id, dispatch])

  const handleRemoveItem = () => {
    setIsRemoving(true)
    setTimeout(() => {
      dispatch(removeFromCart({
        productId: product.id,
        color: product.color,
        size: product.size
      }))
    }, 300)
  }

  return (
    <Box sx={{
      width: '100%',
      display: isRemoving ? 'none' : 'flex',
      height: '100px',
      flexDirection: 'row',
      justifyItems: 'flex-start',
      gap: 1
    }}>
      <img src={product.image} width='100px' />
      {/*     Thông tin sản phẩm thêm     */}
      <Box sx={{
        width: '100%'
      }}>
        <Box sx={{ display: 'flex', justifyContent:'space-between' }}>
          <Typography
            sx={{
              cursor: 'pointer',
              '&:hover': {
                color: '#fcc200'
              }
            }}
            onClick={() => navigate(`/product-details/${product.slug}`)}
          >{product.name}</Typography>
          <ClearIcon
            sx={{
              cursor: 'pointer',
              '&:hover': {
                color: '#fcc200'
              }
            }}
            onClick={handleRemoveItem}
          />
        </Box>
        <Typography sx={{ mt: 1.5 }}>{product.color} / {product.size}</Typography>
        <Box sx={{
          mt: 0.5,
          display: 'flex',
          justifyContent:'space-between',
          alignItems: 'center'
        }}>
          {/* Số lượng sản phẩm */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
            alignItems: 'center',
            border: '1px solid #e1e1e1',
            borderRadius: '5px',
            height: '40px'
          }}>
            <Button
              sx={{
                minWidth: '30px',
                height: '40px',
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
                height: '40px',
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
                height: '40px',
                padding: '5px 16px',
                fontSize: '20px',
                cursor: 'pointer'
              }}
              onClick={handleIncrease}
            >
              +
            </Button>
          </Box>
          <Typography variant='body1' fontWeight='bold'>{formatCurrency(price)}₫</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default CartItem