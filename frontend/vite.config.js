import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/steam': {
        target: 'https://store.steampowered.com/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/steam/, '')
      },
      '/api/igdb': {
        target: 'https://api.igdb.com/v4',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/igdb/, '')
      },
      '/api/steamapi': {
        target: 'https://api.steampowered.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/steamapi/, '')
      }
    }
  }
})
