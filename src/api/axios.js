import axios from "axios"
import { getToken } from "../utils/authStorage"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:8080",
    withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default axiosInstance
