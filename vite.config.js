import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
    },
  },
  server: {
    proxy: {
      '/graphql': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    }
  }
})
