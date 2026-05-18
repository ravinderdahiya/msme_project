import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import dns from 'node:dns'

// Prefer IPv4 on local dev proxy to avoid IPv6-first gateway failures on some networks.
dns.setDefaultResultOrder('ipv4first')


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendTarget = env.VITE_SERVER_URL || 'http://localhost:5000'

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
        '/arcgis': {
          target: 'https://hsacggm.in',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/arcgis/, ''),
        },
        '/user': {
          target: backendTarget,
          changeOrigin: true,
        },
        '/otp': {
          target: backendTarget,
          changeOrigin: true,
        },
        '/api-url': {
          target: backendTarget,
          changeOrigin: true,
        },
        '/mapserver': {
          target: backendTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
