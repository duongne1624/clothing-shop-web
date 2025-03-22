import { Paper, Typography, Grid, Box, Avatar, Rating } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'

// Dữ liệu mẫu cho đánh giá khách hàng
const customerReviews = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    avatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    comment: 'Sản phẩm chất lượng rất tốt, giao hàng nhanh chóng. Tôi rất hài lòng với dịch vụ của shop.',
    date: '15/03/2024'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    avatar: 'https://i.pravatar.cc/150?img=2',
    rating: 4,
    comment: 'Chất lượng sản phẩm tốt, giá cả hợp lý. Nhân viên tư vấn nhiệt tình.',
    date: '14/03/2024'
  },
  {
    id: 3,
    name: 'Lê Văn C',
    avatar: 'https://i.pravatar.cc/150?img=3',
    rating: 5,
    comment: 'Shop có nhiều mẫu mã đẹp, đa dạng. Tôi sẽ quay lại mua hàng.',
    date: '13/03/2024'
  }
]

function CustomerReviews() {
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
      }}>ĐÁNH GIÁ TỪ KHÁCH HÀNG</Typography>
      <Grid container spacing={3}>
        {customerReviews.map((review) => (
          <Grid item xs={12} md={4} key={review.id}>
            <Box sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <Avatar
                src={review.avatar}
                sx={{ width: 80, height: 80, mb: 2 }}
              />
              <Typography variant="h6" sx={{ mb: 1 }}>
                {review.name}
              </Typography>
              <Rating
                value={review.rating}
                readOnly
                precision={0.5}
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {review.comment}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {review.date}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}

export default CustomerReviews
