import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Paper } from '@mui/material'
import { motion } from 'framer-motion'
import useTitle from '~/hook/useTitle'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'

// Dữ liệu mẫu cho tin thời trang
const fashionNews = [
  {
    id: 1,
    title: 'Xu hướng thời trang nam 2024',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22',
    description: 'Khám phá những xu hướng thời trang nam nổi bật trong năm 2024',
    content: 'Năm 2024 chứng kiến sự trở lại của phong cách Y2K với những thiết kế độc đáo...',
    date: '15/03/2024'
  },
  {
    id: 2,
    title: 'Cách mix đồ nam đơn giản mà đẹp',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22',
    description: 'Hướng dẫn cách phối đồ nam đơn giản nhưng vẫn đẹp và chuyên nghiệp',
    content: 'Việc phối đồ không chỉ đơn giản là kết hợp các món đồ với nhau...',
    date: '14/03/2024'
  },
  {
    id: 3,
    title: 'Bí quyết chọn quần jean nam',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22',
    description: 'Những tips chọn quần jean nam phù hợp với dáng người',
    content: 'Quần jean là item không thể thiếu trong tủ đồ của các chàng trai...',
    date: '13/03/2024'
  },
  {
    id: 4,
    title: 'Phong cách thời trang công sở nam',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22',
    description: 'Cách ăn mặc chuyên nghiệp và lịch sự nơi công sở',
    content: 'Thời trang công sở đòi hỏi sự chỉn chu và tinh tế trong cách ăn mặc...',
    date: '12/03/2024'
  },
  {
    id: 5,
    title: 'Chọn giày phù hợp với từng outfit',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22',
    description: 'Hướng dẫn cách chọn giày phù hợp với từng phong cách thời trang',
    content: 'Giày là phụ kiện quan trọng quyết định đến thành công của một outfit...',
    date: '11/03/2024'
  },
  {
    id: 6,
    title: 'Phụ kiện thời trang nam cần có',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22',
    description: 'Những phụ kiện cơ bản mà nam giới nên có trong tủ đồ',
    content: 'Phụ kiện giúp hoàn thiện vẻ ngoài và tạo điểm nhấn cho trang phục...',
    date: '10/03/2024'
  }
]

function FashionNews() {
  useTitle('Tin tức thời trang | TDW Shop')

  return (
    <Box sx={{ pb: 4 }}>
      <Container maxWidth="xl">
        <Breadcrumbs name="Tin tức thời trang" />

        <Paper elevation={0} sx={{ p: 3, mt: 2 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: '#333' }}>
            Tin Tức Thời Trang
          </Typography>

          <Grid container spacing={3}>
            {fashionNews.map((news) => (
              <Grid item xs={12} sm={6} md={4} key={news.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={news.image}
                      alt={news.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="h2"
                        sx={{
                          fontWeight: 600,
                          color: '#333',
                          minHeight: '64px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {news.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          minHeight: '60px',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {news.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', textAlign: 'right' }}
                      >
                        {news.date}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  )
}

export default FashionNews