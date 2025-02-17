import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

export const fetchProductsAPI = async () => {
  const response = await axios.get(`${API_ROOT}/v1/products/`)
  return response.data
}

export const fetchProductDetailsAPI = async (productSlug) => {
  const response = await axios.get(`${API_ROOT}/v1/products/GetDetailsBySlug/${productSlug}`)
  return response.data
}

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
