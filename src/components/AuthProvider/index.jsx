import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from '~/redux/authSlide'

export default function AuthProvider({ children }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  if (loading) return <p>Loading...</p>

  return <>{children}</>
}
