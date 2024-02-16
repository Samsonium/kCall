import {defineConfig} from 'vitest/config';
import {svelte} from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    plugins: [svelte()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./test/setup-test.ts'],
        include: ['./test/component/*.test.ts', './test/unit/*.test.ts']
    }
})
