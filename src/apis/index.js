import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

// // Get product details by Id
// export const fetchProductDetailsAPI = async (productId) => {
//   const response = await axios.get(`${API_ROOT}/v1/products/${productId}`)
//   // Axios sẽ trả kết quả về qua property của nó là data
//   return response.data
// }

// Get product details by slug
export const fetchProductDetailsAPI = async (productSlug) => {
  const response = await axios.get(`${API_ROOT}/v1/products/GetDetailsBySlug/${productSlug}`)
  // Axios sẽ trả kết quả về qua property của nó là data
  return response.data
}
