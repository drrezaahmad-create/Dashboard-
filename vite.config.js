import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: "3005",
  },
})