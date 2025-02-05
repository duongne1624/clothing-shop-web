import { extendTheme } from '@mui/material/styles'

const HEADER_HEIGHT = '75px'
const FOOTER_HEIGHT = '60px'


const theme = extendTheme({
  shop: {
    headerHeight: HEADER_HEIGHT,
    footerHeight: FOOTER_HEIGHT
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#000000' },
        secondary: { main: '#66d985' },
        headerButton: { main: '#000000' }
      }
    },
    dark: {
      palette: {
        primary: { main: '#000000' },
        secondary: { main: '#66d985' },
        headerButton: { main: '#000000' }
      }
    }
  },
  colorSchemeSelector: 'data-mui-color-scheme',
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h6: { fontWeight: 'bold' },
    body2: { fontSize: '0.9rem' }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {}
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
          '&:hover': {
            '.MuiOutlinedInput-notchedOutline': {
              border: 'none'
            }
          },
          '& fieldset': {
            border: 'none !important'
          }
        }
      }
    }
  },
  spacing: '8px'
})

export default theme
