import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import dns from 'node:dns'
import http from 'node:http'
import https from 'node:https'

// Prefer IPv4 on local dev proxy to avoid IPv6-first gateway failures on some networks.
dns.setDefaultResultOrder('ipv4first')
const arcgisProxyAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 12,
  maxFreeSockets: 6,
  timeout: 120000,
})

// Reuse TCP connections to the local backend — avoids ETIMEDOUT when GIS fires many parallel map requests.
const backendProxyAgent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000,
  maxSockets: 32,
  maxFreeSockets: 16,
  timeout: 120000,
  family: 4,
})


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const defaultDevBackendOrigin = env.VITE_DEV_BACKEND_ORIGIN || 'http://127.0.0.1:8083'
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

  // Map/ArcGIS proxy calls can take 30–90s; default Node proxy timeouts cause ETIMEDOUT.
  const backendProxy = {
    target: backendTarget,
    changeOrigin: true,
    agent: backendProxyAgent,
    timeout: 120000,
    proxyTimeout: 120000,
  }

  return {
    plugins: [react()],

  // ✅ ArcGIS fix (IMPORTANT)
  optimizeDeps: {
    exclude: ['@arcgis/core'],
  },

  // ✅ Optional (sirf tab use hoga jab /arcgis API hit hogi)
    server: {
      host: '127.0.0.1',
      open: true,
      allowedHosts:true,
      proxy: {
        '/msme_backend/api': {
          ...backendProxy,
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
          ...backendProxy,
          rewrite: (path) => withBackendBasePath(path),
        },
        '/otp': {
          ...backendProxy,
          rewrite: (path) => withBackendBasePath(path),
        },
        '/api-url': {
          ...backendProxy,
          rewrite: (path) => withBackendBasePath(path),
        },
        '/data-services': {
          ...backendProxy,
          rewrite: (path) => withBackendBasePath(path),
        },
        '/mapserver': {
          ...backendProxy,
          rewrite: (path) => withBackendBasePath(path),
        },
      },
    },
  }
})
