import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Keep fonts as files instead of base64 in the CSS: smaller CSS and a stricter CSP (no data: fonts).
  build: { assetsInlineLimit: 0 },
})
