import { extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  cssVarPrefix: 'mui',
  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
        primary: { main: '#ffcc00' }, // Màu chủ đạo giống Chợ Tốt
        secondary: { main: '#f56a00' }, // Màu phụ
        background: { default: '#ffffff', paper: '#f8f9fa' },
        text: { primary: '#000', secondary: '#555' }
      }
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: { main: '#ffcc00' },
        secondary: { main: '#f56a00' },
        background: { default: '#121212', paper: '#1e1e1e' },
        text: { primary: '#fff', secondary: '#ccc' }
      }
    }
  },
  colorSchemeSelector: 'data-mui-color-scheme',
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h6: { fontWeight: 'bold' },
    body2: { fontSize: '0.9rem' }
  }
})

export default theme
