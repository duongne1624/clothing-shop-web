import { createTheme } from '@mui/material/styles'

const HEADER_HEIGHT = '45px'

const theme = createTheme({
  shop: {
    headerHeight: HEADER_HEIGHT
  },
  palette: {
    primary: { main: '#000000' },
    secondary: { main: '#66d985' },
    headerButton: { main: '#000000' },
    background: { default: '#f8f8f8', footer: '#ffffff' }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h6: { fontWeight: 'bold' },
    body2: { fontSize: '0.9rem' }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '::-webkit-scrollbar': {
          width: '8px',
          height: '8px'
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#c4c4c4',
          borderRadius: '4px'
        },
        '::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#ababab'
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1'
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
            border: 'none'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '& fieldset': {
            border: 'none !important'
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
