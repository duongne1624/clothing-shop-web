import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CategoryHoverMenu from './Category'

function Header() {
  const handleClickSearch = () => {

  }

  return (
    <Box elevation={2} sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: 'auto',
      overflowX: 'auto',
      overflowY: 'hidden',
      px: 2,
      backgroundColor: '#ffba00'
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <img
          src="https://static.chotot.com/storage/APP_WRAPPER/logo/chotot-logo-appwrapper.png"
          alt="logo"
          width={100}
          height={45}
          style={{ objectFit: 'cover' }}
        />
        <CategoryHoverMenu />
        <OutlinedInput
          sx={{
            height: '40px',
            color: 'black',
            backgroundColor: 'white',
            outline: 'none'
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleClickSearch}><SearchIcon /></IconButton>
            </InputAdornment>
          }
        />
      </Box>
      <Box sx={{
        display: 'flex'
      }}>
        <Button
          color="headerButton"
          startIcon= {<AccountCircleOutlinedIcon />}
          endIcon= {<ExpandMoreIcon />}
        >
          Tài khoản
        </Button>
      </Box>
    </Box>
  )
}

export default Header
