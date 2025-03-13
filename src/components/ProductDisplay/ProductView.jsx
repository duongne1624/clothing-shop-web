import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Badge from '@mui/material/Badge'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'

class ProductView {
  constructor(renderer) {
    this.renderer = renderer
  }

  render(products) {
    return this.renderer.render(products)
  }
}

class GridView {
  render(products) {
    return (
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={4} key={product._id}>
            <Badge color="secondary" badgeContent={product.sold > 500 ? 'Hot' : null}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.colors[0].images[0]}
                  alt={product.name}
                />
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{product.name}</Typography>
                    {product.offerIds.length > 0 && <Chip icon={<LocalOfferIcon />} label="Khuyến mãi" color="primary" />}
                  </Box>
                  {product.originalPrice && (
                    <Typography variant="body1" color="textSecondary" sx={{ textDecoration: 'line-through' }}>
                      {product.originalPrice.toLocaleString()} VND
                    </Typography>
                  )}
                  <Typography variant="h6" color="primary">
                    {product.price.toLocaleString()} VND
                  </Typography>
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Button variant="contained" color="primary">Mua ngay</Button>
                    <Button variant="outlined" color="secondary" startIcon={<ShoppingCartIcon />}>Thêm vào giỏ</Button>
                  </Box>
                </CardContent>
              </Card>
            </Badge>
          </Grid>
        ))}
      </Grid>
    )
  }
}

class ListView {
  render(products) {
    return (
      <List>
        {products.map((product) => (
          <ListItem key={product._id}>
            <Box display="flex" flexDirection="column">
              <Typography variant="h6">{product.name}</Typography>
              {product.originalPrice && (
                <Typography variant="body1" color="textSecondary" sx={{ textDecoration: 'line-through' }}>
                  {product.originalPrice.toLocaleString()} VND
                </Typography>
              )}
              <Typography variant="h6" color="primary">
                {product.price.toLocaleString()} VND
              </Typography>
              <Box mt={1} display="flex" gap={1}>
                <Button variant="contained" color="primary">Mua ngay</Button>
                <Button variant="outlined" color="secondary" startIcon={<ShoppingCartIcon />}>Thêm vào giỏ</Button>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    )
  }
}

export { ProductView, GridView, ListView }
