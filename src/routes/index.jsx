import { Route } from 'react-router-dom'
import AdminRoute from './AdminRoute'
import UserLayout from '~/layouts/UserLayout'
import AdminLayout from '~/layouts/AdminLayout'

// Pages
import ProductDetails from '~/pages/Product/_id'
import Home from '~/pages/Home'
import NotFound from '~/pages/NotFound'
import Login from '~/pages/Auth/login'
import Register from '~/pages/Auth/register'
import Cart from '~/pages/Cart/Cart'
import CheckoutsCart from '~/pages/CheckoutsCart'
import OrderSuccess from '~/pages/OrderSuccess'
import Categories from '~/pages/admin/Categories/Categories'
import Search from '~/pages/Search/Search'
import Profile from '~/pages/Users/_id'
import MyOrder from '~/pages/Users/my-order'
import AdminDashboard from '~/pages/admin/Dashboard/Dashboard'
import Product from '~/pages/admin/Products/Products'
import Users from '~/pages/admin/Users/Users'
import Orders from '~/pages/admin/Orders/Orders'
import Payments from '~/pages/admin/Payments/Payments'
import Coupons from '~/pages/admin/Coupons/Coupons'

const routes = (
  <>
    {/* User Routes */}
    <Route element={<UserLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/categories/:slug" element={<Categories />} />
      <Route path="/search/:keyword" element={<Search />} />
      <Route path="/product-details/:slug" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/order-success/:orderId" element={<OrderSuccess />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/my-order" element={<MyOrder />} />
    </Route>

    {/* Auth Routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/checkouts/cart" element={<CheckoutsCart />} />

    {/* Admin Routes (Protected) */}
    <Route element={<AdminRoute />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/products" element={<Product />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/payments" element={<Payments />} />
        <Route path="/admin/coupons" element={<Coupons />} />
      </Route>
    </Route>

    {/* Not Found */}
    <Route path="*" element={<NotFound />} />
  </>
)

export default routes
