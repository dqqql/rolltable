import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps the built bundle portable: works opened locally and on
// GitHub Pages project sites alike.
export default defineConfig({
  base: './',
  plugins: [react()],
})
