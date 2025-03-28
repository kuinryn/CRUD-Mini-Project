import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://backend:5000',
        changeOrigin: true,
        secure: false,
        // Remove the rewrite completely or modify it to keep /api prefix
        // rewrite: (path) => path,  // Option 1: Keep original path
        ws: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying:', req.method, req.url, '→', proxyReq.path)
          })
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err)
            res.writeHead(500, { 'Content-Type': 'text/plain' })
            res.end('Proxy error occurred')
          })
        }
      }
    }
  }
})