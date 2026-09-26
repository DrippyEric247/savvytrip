import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devApiProxy = env.VITE_DEV_API_PROXY?.trim() || 'http://localhost:5000'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: devApiProxy,
          changeOrigin: true,
        },
      },
    },
  }
})
