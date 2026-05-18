import axios from "axios"
import { getToken } from "../utils/authStorage"

const rawBaseUrl = String(import.meta.env.VITE_SERVER_URL || "").trim()
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "")

const axiosInstance = axios.create({
    // Single base path for all frontend API calls.
    // If VITE_SERVER_URL is empty, requests stay relative and can use Vite proxy.
    baseURL: normalizedBaseUrl || "/",
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
