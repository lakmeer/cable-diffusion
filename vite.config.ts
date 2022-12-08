import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

import path from 'path'

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $lib:  path.resolve(__dirname, './src/lib'),
      $nodes: path.resolve(__dirname, './src/nodes'),
      $parts: path.resolve(__dirname, './src/parts'),
      $store: path.resolve(__dirname, './src/stores'),
      $types: path.resolve(__dirname, './src/types/index.ts'),
      $utils: path.resolve(__dirname, './src/lib/utils.ts'),
    }
  }
})
