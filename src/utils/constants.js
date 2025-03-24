let apiRoot = ''

console.log('import.meta.env: ', import.meta.env)
if (import.meta.env.MODE === 'development') {
  apiRoot = 'http://localhost:8017'
}
if (import.meta.env.BUILD_MODE === 'production') {
  apiRoot = 'https://clothing-shop-api-99u0.onrender.com'
}

export const API_ROOT = apiRoot
