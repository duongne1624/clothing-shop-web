import { Box, Grid, Typography } from '@mui/material'
import HouseIcon from '@mui/icons-material/House'
import CarIcon from '@mui/icons-material/DirectionsCar'
import WorkIcon from '@mui/icons-material/Work'
import PetsIcon from '@mui/icons-material/Pets'

const categories = [
  { label: 'Nhà tốt', icon: <HouseIcon sx={{ fontSize: 40, color: '#ffcc00' }} /> },
  { label: 'Xe cộ', icon: <CarIcon sx={{ fontSize: 40, color: '#ffcc00' }} /> },
  { label: 'Việc làm', icon: <WorkIcon sx={{ fontSize: 40, color: '#ffcc00' }} /> },
  { label: 'Thú cưng', icon: <PetsIcon sx={{ fontSize: 40, color: '#ffcc00' }} /> }
]

function Categories() {
  return (
    <Box sx={{ backgroundColor: '#f8f9fa', p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Khám phá danh mục
      </Typography>
      <Grid container spacing={2}>
        {categories.map((category, index) => (
          <Grid item xs={3} key={index}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              {category.icon}
              <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
                {category.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Categories
