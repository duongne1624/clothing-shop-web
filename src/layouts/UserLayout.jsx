import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import Header from '~/components/Header'
import Footer from '~/components/Footer'
import GlobalSnackbar from '~/components/GlobalSnackbar/GlobalSnackbar'
import GlobalLoading from '~/components/GlobalLoading/GlobalLoading'

export default function UserLayout() {
  return (
    <>
      {/* Header */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        width: '100%',
        height: (theme) => theme.shop.headerHeight,
        zIndex: 1000
      }}>
        <Header />
      </Box>

      {/* Content */}
      <Box sx={{
        width: '100%',
        marginTop: (theme) => theme.shop.headerHeight,
        backgroundColor: 'background.main',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        scrollBehavior: 'smooth'
      }}>
        <Outlet />
        <Footer />
      </Box>

      {/* Global Components */}
      <GlobalSnackbar />
      <GlobalLoading />
    </>
  )
}
