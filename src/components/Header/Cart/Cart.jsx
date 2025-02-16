import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Badge from '@mui/material/Badge'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import IconButton from '@mui/material/IconButton'
import { useNavigate } from 'react-router-dom'

function notificationsLabel(count) {
  if (count === 0) {
    return 'no notifications'
  }
  if (count > 99) {
    return 'more than 99 notifications'
  }
  return `${count} notifications`
}

function Cart() {
  const navigate = useNavigate()
  const cart = useSelector((state) => state.cart.cart)

  return (
    <IconButton
      aria-label={notificationsLabel(cart.length)}
      onClick={() => navigate('/cart')}
    >
      <Badge badgeContent={cart.length} color="secondary">
        <ShoppingCartOutlinedIcon color="headerButton" />
      </Badge>
    </IconButton>
  )
}

export default Cart
