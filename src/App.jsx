import Box from '@mui/material/Box'
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from '~/routes'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import GlobalSnackbar from './components/GlobalSnackbar/GlobalSnackbar'

function App() {

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page
            return (
              <Route key={route.path} path={route.path} element={
                <>
                  {route.isUserPage ? (
                    <>
                      {/*         Header          */}
                      <Box sx={{
                        position: 'fixed',
                        top: 0,
                        width: '100%',
                        height: (theme) => theme.shop.headerHeight,
                        zIndex: 1000
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
                        gap: 2,
                        scrollBehavior: 'smooth'
                      }}>
                        {/* <Home /> */}
                        <Page />
                        <Footer />
                      </Box>
                    </>
                  ) : (
                    <>
                      <Page />
                    </>
                  )}
                  <GlobalSnackbar />
                </>
              } />
            )})}
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
