import { useSelector, useDispatch } from 'react-redux'
import { Snackbar, Alert } from '@mui/material'
import { hideSnackbar } from '~/redux/snackbarSlice'

const GlobalSnackbar = () => {
  const dispatch = useDispatch()
  const { open, message, severity } = useSelector((state) => state.snackbar)

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => dispatch(hideSnackbar())}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 5 }}
    >
      <Alert severity={severity} onClose={() => dispatch(hideSnackbar())}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default GlobalSnackbar
