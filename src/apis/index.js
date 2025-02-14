import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

// Get products
export const fetchProductsAPI = async () => {
  // http://localhost:8017/v1/products
  const response = await axios.get(`${API_ROOT}/v1/products/`)
  return response.data
}

// Get product details by slug
export const fetchProductDetailsAPI = async (productSlug) => {
  const response = await axios.get(`${API_ROOT}/v1/products/GetDetailsBySlug/${productSlug}`)
  // Axios sẽ trả kết quả về qua property của nó là data
  return response.data
}
