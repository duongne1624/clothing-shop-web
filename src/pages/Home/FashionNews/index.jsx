import { Paper, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material'

// Dữ liệu mẫu cho tin thời trang
const fashionNews = [
  {
    id: 1,
    title: 'Xu hướng thời trang nam 2024',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    description: 'Khám phá những xu hướng thời trang nam nổi bật trong năm 2024',
    date: '15/03/2024'
  },
  {
    id: 2,
    title: 'Cách mix đồ nam đơn giản mà đẹp',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    description: 'Hướng dẫn cách phối đồ nam đơn giản nhưng vẫn đẹp và chuyên nghiệp',
    date: '14/03/2024'
  },
  {
    id: 3,
    title: 'Bí quyết chọn quần jean nam',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    description: 'Những tips chọn quần jean nam phù hợp với dáng người',
    date: '13/03/2024'
  }
]

function FashionNews() {
  return (
    <Paper sx={{
      display: 'flex',
      flexDirection: 'column',
      mt: 2,
      p: 2,
      alignItems: 'center',
      maxWidth: '100%',
      bgcolor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)'
      }
    }}>
      <Typography variant='h6' sx={{
        color: '#333',
        fontWeight: 600,
        mb: 2
      }}>TIN THỜI TRANG</Typography>
      <Grid container spacing={3}>
        {fashionNews.map((news) => (
          <Grid item xs={12} md={4} key={news.id}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                cursor: 'pointer',
                transform: 'translateY(-5px)'
              }
            }}>
              <CardMedia
                component="img"
                height="auto"
                image={news.image}
                alt={news.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2" sx={{
                  color: '#333',
                  fontWeight: 500
                }}>
                  {news.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {news.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {news.date}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}

export default FashionNews