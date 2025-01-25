import { extendTheme } from '@mui/material/styles'

const HEADER_HEIGHT = '60px'
const FOOTER_HEIGHT = '60px'


const theme = extendTheme({
  shop: {
    headerHeight: HEADER_HEIGHT,
    footerHeight: FOOTER_HEIGHT
  },
  colorSchemes: {
    light: {},
    dark: {}
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
    }
  },
  spacing: '8px'
})

export default theme
