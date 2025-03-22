import { createTheme } from '@mui/material/styles'

const HEADER_HEIGHT = '35px'

const theme = createTheme({
  shop: {
    headerHeight: HEADER_HEIGHT
  },
  palette: {
    primary: { main: '#000000' },
    secondary: { main: '#66d985' },
    headerButton: { main: '#000000' },
    background: { default: '#f8f8f8', footer: '#ffffff' },
    badge: { main: '#737373' }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h6: { fontWeight: 'bold' },
    body2: { fontSize: '0.9rem' }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        scrollbarWidth: 'none', // Firefox
        '&::-webkit-scrollbar': { display: 'none' }, // Chrome, Safari
        '::-webkit-scrollbar': {
          // width: '8px',
          // height: '8px'
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#5e5e5e',
          borderRadius: '4px'
        },
        '::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#333333'
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: '#b3b3b3'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: '400'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: '#000000',
          fontSize: '0.875rem',
          '.MuiOutlinedInput-notchedOutline': {
            border: '1px solid #919191'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: '1px solid #919191'
          },
          '& fieldset': {
            border: '1px solid #919191 !important'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none'
        }
      }
    }
  },
  spacing: 8
})

export default theme
