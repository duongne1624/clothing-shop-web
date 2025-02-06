import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MuiBreadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'

function handleClick(event) {
  event.preventDefault()
}

function Breadcrumbs() {
  return (
    <Box role="presentation" onClick={handleClick} sx={{ pl: 2, py: 2 }}>
      <MuiBreadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          MUI
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/material-ui/getting-started/installation/"
        >
          Core
        </Link>
        <Typography sx={{ color: 'text.primary' }}>Breadcrumbs</Typography>
      </MuiBreadcrumbs>
    </Box>
  )
}

export default Breadcrumbs