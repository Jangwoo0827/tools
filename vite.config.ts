import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import manifest from './manifest.config.ts'

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    port: 5173,
    strictPort: true,
    cors: { origin: /chrome-extension:\/\// },
    hmr: { port: 5173 },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
