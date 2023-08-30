import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import {sveltePreprocess} from 'svelte-preprocess/dist/autoProcess';

export default defineConfig({
  plugins: [svelte({
    preprocess: sveltePreprocess({
      scss: true
    })
  })],
})
