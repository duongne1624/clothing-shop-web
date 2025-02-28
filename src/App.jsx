import { BrowserRouter as Router, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import routes from '~/routes/index'

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>{routes}</Routes>
      </Router>
    </Provider>
  )
}
