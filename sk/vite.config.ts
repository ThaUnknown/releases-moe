import { sveltekit } from '@sveltejs/kit/vite'
import { enhancedImages } from '@sveltejs/enhanced-img'
import type { UserConfig } from 'vite'
import fs from 'fs'

// detect if we're running inside docker and set the backend accordingly
const pocketbaseUrl = fs.existsSync('/.dockerenv')
  ? 'http://pb:59992' // docker-to-docker
  : 'http://127.0.0.1:59992' // localhost-to-localhost

const config: UserConfig = {
  plugins: [
    enhancedImages(),
    sveltekit()
  ],
  server: {
    port: 59991,
    proxy: {
      // proxy "/api" and "/_" to pocketbase_url
      '/api': pocketbaseUrl,
      '/_': pocketbaseUrl
    }
  },
  resolve: {
    alias: {
      path: 'path-esm'
    }
  },
  optimizeDeps: {
    exclude: ['anitomyscript']
  }
}

export default config
