import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true
  },
  build: {
    chunkSizeWarningLimit: 2000
  },
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }
})
