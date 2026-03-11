import axios from "axios"

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

// Attach JWT token
axiosClient.interceptors.request.use((config) => {

  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Handle response error
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error)
    throw error
  }
)

export default axiosClient