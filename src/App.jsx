import Box from '@mui/material/Box'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductDetails from './pages/Product/_id'

function App() {

  return (
    <>
      {/*         Header          */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        width: '100%',
        height: (theme) => theme.shop.headerHeight
      }}>
        <Header />
      </Box>

      {/*         Content          */}
      <Box sx={{
        width: '100%',
        marginTop:(theme) => theme.shop.headerHeight,
        backgroundColor: 'background.main',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {/* <Home /> */}
        <ProductDetails />
        <Footer />
      </Box>
    </>
  )
}

export default App
