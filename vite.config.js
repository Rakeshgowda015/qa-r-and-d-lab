import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Set VITE_BASE_PATH to "/<repository-name>/" for a GitHub Pages project site.
  base: process.env.VITE_BASE_PATH || '/',
})
