import { Card, CardMedia, CardContent, Typography, Divider, ToggleButtonGroup, ToggleButton } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

function Product(proc) {
  const media = '/public/Images/Products/ao-hoodie-nam-xanh.jpg'

  return (
    <Card
      sx={{
        width: {
          xs: '45%',
          sm: '200px',
          md: '235px'
        },
        height: 'auto',
        alignContent: 'center',
        p: 1,
        bgcolor: 'background.product',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardMedia
        component="img"
        image={media}
        alt=""
        sx={{
          width: '90%',
          height: 'auto',
          maxHeight: '150px',
          objectFit: 'contain',
          ml: 1,
          mt: 1
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontSize: { xs: '1rem', sm: '1.2rem' },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {proc.name}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          {proc.price}
        </Typography>
      </CardContent>
      <Divider />
      <ToggleButtonGroup
        fullWidth
        exclusive
        aria-label="text alignment"
        size="small"
        sx={{
          p: 1,
          '& .MuiToggleButton-root': {
            borderRadius: 0,
            p: 0.75,
            '&:not(.Mui-selected)': {
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent'
            },
            '&:first-of-type': {
              borderLeftColor: 'transparent'
            },
            '&:last-of-type': {
              borderRightColor: 'transparent'
            },
            '&:hover': {
              bgcolor: 'transparent',
              color: 'black'
            }
          }
        }}
      >
        <ToggleButton onClick={proc.onClickAddCart} disableRipple>
          <ShoppingCartIcon />
        </ToggleButton>
        <ToggleButton onClick={proc.onClickView} disableRipple>
          <VisibilityOutlinedIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Card>
  )
}

export default Product
