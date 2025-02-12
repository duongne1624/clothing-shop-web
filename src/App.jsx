import Box from '@mui/material/Box'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductDetails from './pages/Product/_id'

function App() {

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw'
    }}>
      <Box sx={{
        width: '100%',
        height: (theme) => theme.shop.headerHeight
      }}>
        <Header />
      </Box>

      <Box sx={{
        width: '100%',
        height: (theme) => `calc(100% - ${theme.shop.headerHeight})`,
        backgroundColor: 'background.main',
        overflowX: 'hidden',
        overflowY: 'auto'
      }}>
        {/* <Home /> */}
        <ProductDetails />
        <Footer />
      </Box>
    </Box>
  )
}

export default App
