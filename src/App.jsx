import { BrowserRouter as Router, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import routes from '~/routes/index'
import GlobalSnackbar from '~/components/GlobalSnackbar/GlobalSnackbar'
import GlobalLoading from '~/components/GlobalLoading/GlobalLoading'

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>{routes}</Routes>
      </Router>
      {/* Global Components */}
      <GlobalSnackbar />
      <GlobalLoading />
    </Provider>
  )
}
