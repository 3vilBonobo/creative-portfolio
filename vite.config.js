import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { sites } from '@openai/sites-vite-plugin'
import { mkdirSync, writeFileSync } from 'node:fs'

const staticWorker = {
  name: 'portfolio-static-worker',
  closeBundle() {
    mkdirSync('dist/server', { recursive: true })
    writeFileSync('dist/server/index.js', 'export default { fetch(request, env) { return env.ASSETS.fetch(request) } }\n')
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    sites(),
    staticWorker,
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
