import ProductDetails from '~/pages/Product/_id'
import Home from '~/pages/Home'
import NotFound from '~/pages/NotFound'
import Login from '~/pages/Auth/login'
import Register from '~/pages/Auth/register'
import Cart from '~/pages/Cart/Cart'

export const routes = [
  {
    path: '/',
    page: Home,
    isUserPage: true
  },
  {
    path: '/home',
    page: Home,
    isUserPage: true
  },
  {
    path: '/product-details/:slug',
    page: ProductDetails,
    isUserPage: true
  },
  {
    path: '/login',
    page: Login
  },
  {
    path: '/register',
    page: Register
  },
  {
    path: '/cart',
    page: Cart,
    isUserPage: true
  },
  {
    path: '*',
    page: NotFound
  }
]