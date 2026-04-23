import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dns from 'node:dns'

// Prefer IPv4 on local dev proxy to avoid IPv6-first gateway failures on some networks.
dns.setDefaultResultOrder('ipv4first')


export default defineConfig({
  plugins: [react()],

  // ✅ ArcGIS fix (IMPORTANT)
  optimizeDeps: {
    exclude: ['@arcgis/core'],
  },

  // ✅ Optional (sirf tab use hoga jab /arcgis API hit hogi)
  server: {
    proxy: {
      '/arcgis': {
        target: 'https://hsacggm.in',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/arcgis/, ''),
      },
    },
  },
})
