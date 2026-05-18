import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('react') || id.includes('react-router-dom')) {
            return 'react'
          }

          if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
            return 'charts'
          }

          if (
            id.includes('react-hook-form') ||
            id.includes('zustand') ||
            id.includes('axios')
          ) {
            return 'forms'
          }

          return 'vendor'
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.test.{js,jsx}'],
    css: true,
  },
})
