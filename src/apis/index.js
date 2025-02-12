import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

export const fetchProductDetailsAPI = async (productId) => {
  const response = await axios.get(`${API_ROOT}/v1/products/${productId}`)
  // Axios sẽ trả kết quả về qua property của nó là data
  return response.data
}
