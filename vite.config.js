import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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