import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

function Policies() {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      overflowX: 'auto',
      overflowY: 'hidden',
      py: 3,
      px: 2
    }}>
      <Paper
        elevation={0}
        sx={{
          minWidth: '280px',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <img src="https://file.hstatic.net/1000360022/file/giaohangnhanh_abaa5d524e464a0c8547a91ad9b50968.png" alt="policies_icon_1" width="40" height="40" loading="lazy" />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>Miễn phí vận chuyển</Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>Đơn từ 399k</Typography>
        </Box>
      </Paper>
      <Paper
        elevation={0}
        sx={{
          minWidth: '280px',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <img src="https://file.hstatic.net/1000360022/file/giaohang_2943ae148bf64680bf20c3d881c898c9.png" alt="policies_icon_2" width="40" height="40" loading="lazy" />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>Đổi hàng tận nhà</Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>Trong vòng 15 ngày</Typography>
        </Box>
      </Paper>
      <Paper
        elevation={0}
        sx={{
          minWidth: '280px',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <img src="https://file.hstatic.net/1000360022/file/cod_5631433f0ad24c949e44e512b8535c43.png" alt="policies_icon_3" width="40" height="40" loading="lazy" />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>Thanh toán COD</Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>Yên tâm mua sắm</Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default Policies
