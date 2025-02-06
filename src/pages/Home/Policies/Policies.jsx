import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function Policies() {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      justifyContent: 'space-between'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <img src="https://file.hstatic.net/1000360022/file/giaohangnhanh_abaa5d524e464a0c8547a91ad9b50968.png" alt="policies_icon_1" width="40" height="40" loading="lazy" />
        <Box>
          <Typography variant="h6">Miễn phí vận chuyển</Typography>
          <Typography variant="body1">Đơn từ 399k</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <img src="https://file.hstatic.net/1000360022/file/giaohang_2943ae148bf64680bf20c3d881c898c9.png" alt="policies_icon_2" width="40" height="40" loading="lazy" />
        <Box>
          <Typography variant="h6">Đổi hàng tận nhà</Typography>
          <Typography variant="body1">Trong vòng 15 ngày</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <img src="https://file.hstatic.net/1000360022/file/cod_5631433f0ad24c949e44e512b8535c43.png" alt="policies_icon_3" width="40" height="40" loading="lazy" />
        <Box>
          <Typography variant="h6">Thanh toán COD</Typography>
          <Typography variant="body1">Yên tâm mua sắm </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Policies