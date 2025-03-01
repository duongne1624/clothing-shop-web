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

export const fetchProductDetailsAPIById = async (productId) => {
  const response = await axios.get(`${API_ROOT}/v1/products//${productId}`)
  return response.data
}

export const getCouponByCode = async (code) => {
  const response = await axios.get(`${API_ROOT}/v1/coupons/GetCouponByCode/${code}`)
  return response.data
}

export const createOrder = async (orderData) => {
  const response = await axios.post(`${API_ROOT}/v1/orders`, orderData)
  return response.data
}

export const getOrderById = async (orderId) => {
  const response = await axios.get(`${API_ROOT}/v1/orders/${orderId}`)
  return response.data
}

export const getAllProductByCategorySlug = async (categorySlug) => {
  const response = await axios.get(`${API_ROOT}/v1/products/GetProductsByCategorySlug/${categorySlug}`)
  return response.data
}

export const searchProduct = async (keyword) => {
  const response = await axios.get(`${API_ROOT}/v1/products/Search/${keyword}`)
  return response.data
}

export const getCategoriesAPI = async () => {
  const response = await axios.get(`${API_ROOT}/v1/categories/GetHierarchy/get`)
  return response.data
}

export const getUsers = async () => {
  const response = await axios.get(`${API_ROOT}/v1/users`)
  return response.data
}

export const paymentOrder = async (orderData) => {
  const response = await axios.post(`${API_ROOT}/v1/payments`, orderData)
  return response.data
}

// Login, register, logout
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

// Users
export const userApi = {
  getUsers: async () => {
    try {
      const response = await axios.get(`${API_ROOT}/v1/users`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi không xác định' }
    }
  },

  addUser: async (data) => {
    try {
      const response = await axios.post(`${API_ROOT}/v1/users`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi không xác định' }
    }
  },

  updateUser: async (id, data) => {
    try {
      const response = await axios.put(`${API_ROOT}/v1/users/${id}`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi không xác định' }
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${API_ROOT}/v1/users/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi không xác định' }
    }
  }
}

// Categories
export const categoryApi = {
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_ROOT}/v1/categories`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi không xác định' }
    }
  },

  createCategory: async (data) => {
    try {
      const response = await axios.post(`${API_ROOT}/v1/categories`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi không xác định' }
    }
  },

  updateCategory: async (id, data) => {
    try {
      const response = await axios.put(`${API_ROOT}/v1/categories/${id}`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi không xác định' }
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await axios.delete(`${API_ROOT}/v1/categories/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi không xác định' }
    }
  }
}

// Products
export const productApi = {
  getProducts: async () => {
    try {
      const response = await axios.get(`${API_ROOT}/v1/products`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi không xác định' }
    }
  },

  createProduct: async (data) => {
    try {
      const response = await axios.post(`${API_ROOT}/v1/products`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi không xác định' }
    }
  },

  updateProduct: async (id, data) => {
    try {
      const response = await axios.put(`${API_ROOT}/v1/products/${id}`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi không xác định' }
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await axios.delete(`${API_ROOT}/v1/products/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi không xác định' }
    }
  }
}
