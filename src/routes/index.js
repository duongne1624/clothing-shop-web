import ProductDetails from '~/pages/Product/_id'
import Home from '~/pages/Home'
import NotFound from '~/pages/NotFound'

export const routes = [
  {
    path: '/',
    page: Home,
    isUserPage: true
  },
  {
    path: '/product-details/:slug',
    page: ProductDetails,
    isUserPage: true
  },
  {
    path: '*',
    page: NotFound
  }
]