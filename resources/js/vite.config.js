import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../public/build', // <--- así el build sale en public/build/
    emptyOutDir: true,
  },
})
