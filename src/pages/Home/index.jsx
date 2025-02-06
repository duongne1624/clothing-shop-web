import { Box, Paper } from '@mui/material'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import Banner from './Banner/Banner'
import Policies from './Policies/Policies'
import VoucherList from './VoucherList/VoucherList'
import NewProductLists from './NewProductLists/NewProductLists'

function Home() {
  return (
    <>
      <Paper sx={{
        width: {
          xl: '70%',
          sm: '80%',
          xs: '100%'
        },
        height: 'fit-content',
        ml: {
          xl: '15%',
          sm: '10%',
          xs: '0'
        },
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Breadcrumbs />
        {/***************************Banner**************************/}
        <Banner />
        <Box sx={{
          pt: 5,
          px: {
            xl: 15,
            lg: 10,
            md: 5,
            sm: 2,
            xs: 0
          },
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          <Policies />
          {/***************************Ưu đãi**************************************/}
          <VoucherList />
          <NewProductLists />
          <Box>Sản phẩm bán chạy</Box>
          <Box>Blog</Box>
        </Box>
      </Paper>
    </>
  )
}

export default Home
