import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    alias: {
      $lib: 'src/lib',
      '@/*': './src/lib/*'

    },
    adapter: adapter()
  }
}

export default config
