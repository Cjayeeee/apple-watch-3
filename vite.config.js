import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    // three.js + R3F are isolated in the lazily-loaded WatchScene chunk
    chunkSizeWarningLimit: 700,
  },
})
