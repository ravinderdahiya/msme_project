import axios from "axios"
import { getToken } from "../utils/authStorage"

const rawBaseUrl = String(
    import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_SERVER_URL || ""
).trim()
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "")
const isDev = Boolean(import.meta.env.DEV)
const isRelativeApiBase = normalizedBaseUrl.startsWith("/")
const isLocalBackendUrl =
    isRelativeApiBase ||
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(normalizedBaseUrl)
const defaultProxyBasePath = "/msme_backend/api"
const resolvedBaseUrl =
    isDev && isLocalBackendUrl ? defaultProxyBasePath : (normalizedBaseUrl || defaultProxyBasePath)

const axiosInstance = axios.create({
    // Single base path for all frontend API calls.
    // In dev, prefer Vite proxy when backend URL is local/empty.
    baseURL: resolvedBaseUrl,
    withCredentials: true,
})

export const setHttpAuthToken = (token) => {
    const t = String(token || "").trim()
    if (t) {
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${t}`
        return
    }
    delete axiosInstance.defaults.headers.common.Authorization
}

setHttpAuthToken(getToken())

axiosInstance.interceptors.request.use((config) => {
    const token = getToken()
    if (!token && config?.headers?.Authorization) {
        delete config.headers.Authorization
    }
    if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default axiosInstance
