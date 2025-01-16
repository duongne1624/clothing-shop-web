import { extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  cssVarPrefix: 'mui',
  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
        primary: { main: '#ffcc00' },
        secondary: { main: '#f56a00' },
        shadow: { main: 'black' },
        background: { default: '#ffffff', banner: '04336b', paper: 'white', appbar: 'white' },
        text: { primary: '#000', secondary: '#555', marquee: '#fff', appbar: 'black' }
      }
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: { main: '#ffcc00' },
        secondary: { main: '#f56a00' },
        shadow: { main: 'white' },
        background: { default: '#121212', banner: '04336b', paper: 'white', appbar: 'black' },
        text: { primary: '#fff', secondary: '#ccc', marquee: '#fff', appbar: 'white' }
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
