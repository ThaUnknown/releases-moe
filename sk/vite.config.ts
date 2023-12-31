import { sveltekit } from '@sveltejs/kit/vite'
import type { UserConfig } from 'vite'
import fs from 'fs'

// detect if we're running inside docker and set the backend accordingly
const pocketbaseUrl = fs.existsSync('/.dockerenv')
  ? 'http://pb:59991' // docker-to-docker
  : 'http://127.0.0.1:59991' // localhost-to-localhost

const config: UserConfig = {
  plugins: [sveltekit()],
  server: {
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
