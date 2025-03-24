let apiRoot = ''

if (import.meta.env.MODE === 'development') {
  // apiRoot = 'https://clothing-shop-api-99u0.onrender.com'
  apiRoot = 'http://localhost:8017'
}
if (import.meta.env.MODE === 'production') {
  apiRoot = 'https://clothing-shop-api-99u0.onrender.com'
}
export const API_ROOT = apiRoot
