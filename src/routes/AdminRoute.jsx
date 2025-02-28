import { Navigate, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { showSnackbar } from '~/redux/snackbarSlice'

export default function AdminRoute() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()

  dispatch(showSnackbar({ message: 'Người dùng không đủ thẩm quyền!', severity: 'error' }))

  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />
}
