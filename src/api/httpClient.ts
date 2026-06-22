import axios from 'axios'

export const httpClient = axios.create({
  baseURL: '/api',
})

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('token')

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)
