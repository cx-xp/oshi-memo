// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/oshi-memo/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',  // ここでExpressサーバーに転送
    }
  }
})
