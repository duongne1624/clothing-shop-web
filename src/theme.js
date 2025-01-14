import { extendTheme } from '@mui/material/styles';

const theme = extendTheme({
  cssVarPrefix: 'mui',
  colorSchemes: {
    light: {
      palette: { mode: 'light' },
    },
    dark: {
      palette: { mode: 'dark' },
    },
  },
  colorSchemeSelector: 'data-mui-color-scheme',
});

export default theme;
