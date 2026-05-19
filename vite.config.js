import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import dns from 'node:dns'

// Prefer IPv4 on local dev proxy to avoid IPv6-first gateway failures on some networks.
dns.setDefaultResultOrder('ipv4first')


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const rawApiBaseUrl = env.VITE_API_BASE_URL || env.VITE_SERVER_URL || 'http://localhost:5000'
  const apiBaseUrl = /^https?:\/\//i.test(rawApiBaseUrl) ? rawApiBaseUrl : 'http://localhost:5000'
  const parsedApiUrl = new URL(apiBaseUrl)
  const backendTarget = parsedApiUrl.origin
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
        },
        '/arcgis': {
          target: 'https://hsacggm.in',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/arcgis/, ''),
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
