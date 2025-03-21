import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Remove this line: import tailwindcss from '@tailwindcss/vite' 

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Remove tailwindcss() from here
    react()
  ],
})