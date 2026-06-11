import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4999',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:4999',
        changeOrigin: true,
        rewrite: (path) => '/api' + path,
      },
    },
  },
})
