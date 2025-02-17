import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MuiBreadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'

function Breadcrumbs({ category, categoryId, name }) {
  return (
    <Box role="presentation" sx={{ pl: 2, py: 0.75 }}>
      <MuiBreadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/" sx={{ '&:hover':{ textDecoration: 'none' } }}>
          Trang chủ
        </Link>
        {category && (
          <Link
            underline="hover"
            color="inherit"
            href={`/category/${categoryId}`}
            sx={{ '&:hover':{ textDecoration: 'none' } }}
          >
            {category}
          </Link>
        )}
        {name && (
          <Typography sx={{ color: 'text.primary' }}>{name}</Typography>
        )}
      </MuiBreadcrumbs>
    </Box>
  )
}

export default Breadcrumbs
