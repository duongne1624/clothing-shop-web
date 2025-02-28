import { useSelector } from 'react-redux'
import { CircularProgress } from '@mui/material'

function GlobalLoading() {
  const isLoading = useSelector(state => state.loading.isLoading)

  return isLoading ? <CircularProgress size={30} sx={{ position: 'fixed', top: 20, right: 20 }} /> : null
}

export default GlobalLoading
