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

// export const fetchLoginAPI = async (data) => {
//   const { email, password } = data
//   const response = await axios.post(`${API_ROOT}/v1/users/login`, {
//     email,
//     password
//   })
//   return response.data
// }

export const authApi = {
  login: async (data) => {
    try {
      const response = await axios.post(`${API_ROOT}/v1/users/login`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi không xác định' }
    }
  },

  register: async (data) => {
    try {
      const response = await axios.post(`${API_ROOT}/v1/users/register`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi không xác định' }
    }
  },

  logout: () => {
    localStorage.removeItem('token')
  }
}
