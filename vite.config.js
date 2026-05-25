import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import dns from 'node:dns'
import https from 'node:https'

// Prefer IPv4 on local dev proxy to avoid IPv6-first gateway failures on some networks.
dns.setDefaultResultOrder('ipv4first')
const arcgisProxyAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 4,
  maxFreeSockets: 2,
  timeout: 120000,
})


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const defaultDevBackendOrigin = env.VITE_DEV_BACKEND_ORIGIN || 'http://127.0.0.1:8080'
  const rawApiBaseUrl = env.VITE_API_BASE_URL || env.VITE_SERVER_URL || `${defaultDevBackendOrigin}/msme_backend/api`
  const apiBaseUrl = /^https?:\/\//i.test(rawApiBaseUrl)
    ? rawApiBaseUrl
    : `${defaultDevBackendOrigin}${rawApiBaseUrl.startsWith('/') ? rawApiBaseUrl : `/${rawApiBaseUrl}`}`
  const parsedApiUrl = new URL(apiBaseUrl)
  const devBackendOrigin = String(env.VITE_DEV_BACKEND_ORIGIN || '').trim().replace(/\/+$/, '')
  const backendTarget =
    (mode !== 'production' && /^https?:\/\//i.test(devBackendOrigin))
      ? devBackendOrigin
      : parsedApiUrl.origin
  const backendBasePath = parsedApiUrl.pathname.replace(/\/+$/, '')
  const withBackendBasePath = (path) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${backendBasePath}${cleanPath}`
  }

  return {
    plugins: [react()],

  // ✅ ArcGIS fix (IMPORTANT)
  optimizeDeps: {
    exclude: ['@arcgis/core'],
  },

  // ✅ Optional (sirf tab use hoga jab /arcgis API hit hogi)
    server: {
      host: 'localhost',
      open: true,
      proxy: {
        '/msme_backend/api': {
          target: backendTarget,
          changeOrigin: true,

          rewrite: (path) => {
            const suffix = path.replace(/^\/msme_backend\/api/, '')
            const rewritten = `${backendBasePath}${suffix}`
            return rewritten || '/'
          },

        },
        '/arcgis': {
          target: 'https://hsacggm.in',
          changeOrigin: true,
          secure: false,
          agent: arcgisProxyAgent,
          timeout: 120000,
          proxyTimeout: 120000,
          rewrite: (path) => path.replace(/^\/arcgis/, ''),
        },
        '/investhry': {
          target: 'https://investhry.harsac.in',
          changeOrigin: true,
          secure: false,
          agent: arcgisProxyAgent,
          timeout: 120000,
          proxyTimeout: 120000,
          rewrite: (path) => path.replace(/^\/investhry/, ''),
        },
        '/user': {
          target: backendTarget,
          changeOrigin: true,
          rewrite: (path) => withBackendBasePath(path),
        },
        '/otp': {
          target: backendTarget,
          changeOrigin: true,
          rewrite: (path) => withBackendBasePath(path),
        },
        '/api-url': {
          target: backendTarget,
          changeOrigin: true,
          rewrite: (path) => withBackendBasePath(path),
        },
        '/data-services': {
          target: backendTarget,
          changeOrigin: true,
          rewrite: (path) => withBackendBasePath(path),
        },
        '/mapserver': {
          target: backendTarget,
          changeOrigin: true,
          rewrite: (path) => withBackendBasePath(path),
        },
      },
    },
  }
})
