import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Binds the server to all interfaces
    port: 5173,      // You can set it to 5173 or match the Docker exposed port
  },

})
