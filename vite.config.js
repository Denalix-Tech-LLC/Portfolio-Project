import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Minimal Vite config — React plugin only, no extra magic.
export default defineConfig({
  plugins: [react()],
})
